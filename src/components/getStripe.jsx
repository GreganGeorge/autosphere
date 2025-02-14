import {loadStripe} from '@stripe/stripe-js';

let stripePromise;

const getStripe=()=>{
    if(!stripePromise){
        console.log('pk',process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        stripePromise=loadStripe('pk_test_51P2BgZSAzlT6XHrmRqB6GtO9EsXpgACjyDyyXoe27XlLTUcJOoOr7ZL2jIUplaw1tiFA6P555aBeJcVDG4ymKkR100PcI3TmGD');
    }
    return stripePromise; 
}

export default getStripe;