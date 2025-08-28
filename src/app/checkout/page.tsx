import CheckoutWizard from "../../components/checkout-wizard";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold font-headline mb-6 text-center">
        Secure Checkout
      </h1>
      <CheckoutWizard />
    </div>
  );
}
