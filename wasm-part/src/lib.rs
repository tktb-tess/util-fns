use num_bigint::{BigInt, Sign};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn wasm_mod_pow(b: String, e: String, m: String) -> String {
    let msg: &'static str = "Casting to BigInt";
    let b_bi: BigInt = b.parse().expect(msg);
    let e_bi: BigInt = e.parse().expect(msg);
    let m_bi: BigInt = {
        let m_: BigInt = m.parse().expect(msg);
        if m_ == BigInt::ZERO {
            panic!("Modulo is zero")
        };
        if m_.sign() == Sign::Minus { -m_ } else { m_ }
    };

    b_bi.modpow(&e_bi, &m_bi).to_string()
}
