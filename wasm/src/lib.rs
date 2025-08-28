use num_bigint::{BigUint, ToBigUint};
// use wasm_bindgen::prelude::*;

pub fn miller_rabin_at_base_2(n: BigUint) -> bool {
    let n_ref = &n;
    if n <= 1.to_biguint().expect("to BigUint") {
        false
    } else if n_ref % 2.to_biguint().expect("to BigUint") == BigUint::ZERO {
        n == 2.to_biguint().expect("to BigUint")
    } else {
        true
    }
}


