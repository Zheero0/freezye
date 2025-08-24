import { NextRequest, NextResponse } from 'next/server';
import EasyPost from '@easypost/api';

const api = new EasyPost(process.env.EASYPOST_API_KEY!);

type Addr = {
  name?: string; street1: string; street2?: string;
  city: string; state?: string; zip: string; country: string;
  phone?: string; email?: string;
};
type Body = {
  to: Addr; from: Addr;
  parcel: { length: number; width: number; height: number; weight: number }; // cm + g
  label_format?: 'PDF'|'PNG'|'ZPL';
};

export async function POST(req: NextRequest) {
  try {
    const b = (await req.json()) as Body;

    // EasyPost API has been updated to not require verification for addresses.
    const to = await api.Address.create(b.to);
    const from = await api.Address.create(b.from);

    const shipment = await api.Shipment.create({
      to_address: to,
      from_address: from,
      parcel: {
        length: b.parcel.length, 
        width: b.parcel.width, 
        height: b.parcel.height,
        weight: b.parcel.weight,
      }
    });

    const boughtShipment = await shipment.buy(shipment.lowestRate());

    if (b.label_format && b.label_format !== (boughtShipment.postage_label?.label_format || 'PDF')) {
        await boughtShipment.convertLabelFormat(b.label_format);
    }
    
    const rate = shipment.lowestRate();

    return NextResponse.json({
      trackingCode: boughtShipment.tracking_code,
      carrier: rate.carrier, service: rate.service,
      amount: rate.rate, currency: rate.currency,
      labelUrl: boughtShipment.postage_label?.label_url,
      labelFormat: boughtShipment.postage_label?.label_format || 'PDF'
    });
  } catch (e: any) {
    // Correctly handle EasyPost errors which may be in e.errors
    const errorMessage = e.errors ? e.errors.map((err: any) => err.message).join(', ') : (e?.message ?? 'Label error');
    return NextResponse.json({ error: errorMessage }, { status: e.statusCode || 500 });
  }
}
