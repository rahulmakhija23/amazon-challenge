import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import axios from "./axios";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Link } from "react-router-dom";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { getBasketTotal } from "./reducer";
import { useStateValue } from "./StateProvider";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
function Payment() {
  // #4 these are most powerfull hook for
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [{ basket, user }, dispatch] = useStateValue();

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");

  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    //generate that speical stripe secret allows
    // #10 client secret will help the payemnt to fullfill and each payment whatever amount it is will have a client secret
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // headers: { "Content-Type": "application/json" },
        //stripe expects the total  in a curruncies subunit
        //example if you need to pass 10$ then u need to write 10000
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
        //convert according to format currency you need like ruppe
      });
      setClientSecret(response.data.clientSecret);
      //set this up later when we st up backend
    };
    getClientSecret();
    // #11 so whenever the basket changes it will make the request and will update the special stripe secret which allows to charge the customer
  }, [basket]);
  // #14
  console.log("this is client secret >>>>>>", clientSecret);
  const handleSubmit = async (event) => {
    //do all the facncy stripe stuff...
    event.preventDefault();
    setProcessing(true); // #9 will set the processing to true once the user click buy button
    // #12
    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation
        console.log("person >>>>>>>>>>>>>>>>", user);
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        setSucceeded(true);
        setError(null);
        setProcessing(false);

        dispatch({
          type: "EMPTY_BASKET",
        });

        navigate("/orders");
      });
  };
  const handleChange = (event) => {
    //#6
    //listen  for chnage in the cardElement
    //and display   any errors as the customer   types their card details
    setDisabled(event.empty); //disable the button when user types nothing
    setError(event.error ? event.error.message : ""); //show the error whenevr there is a error shown
  };
  return (
    <div className="payment">
      <div className="payment_container">
        <h1>
          Checkout(<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        {/* payment section delivery address */}
        <div className="payment_section">
          <div className="payment_title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment_address">
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>

        {/* payment section-Review Items */}
        <div className="payment_section">
          <div className="payment_title">
            <h3>Review Items and delivery</h3>
          </div>
          <div className="payment_items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                price={item.price}
                rating={item.rating}
                image={item.image}
              />
            ))}
          </div>
        </div>

        {/* payment section - payment method*/}
        <div className="payment_section">
          <div className="payment_title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment_details">
            {/* stripe */}
            {/*  #6 This  is  the form  where payment gateway will be loading */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payemnt_priceConatainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total:{value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {/*  #8 error will be handled here and any error will shown related to it */}
              {error && <div>{error}</div>}
            </form>
          </div>
          {/* upgrade to blaze on firebase  */}
        </div>
      </div>
    </div>
  );
}

export default Payment;
