use num_bigint::BigInt;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn wasm_test_func(b: String, e: String, m: String) -> String {
    let msg: &'static str = "casting to BigInt";
    let b_bi: BigInt = b.parse().expect(msg);
    let e_bi: BigInt = e.parse().expect(msg);
    let m_bi: BigInt = m.parse().expect(msg);
    b_bi.modpow(&e_bi, &m_bi).to_string()
}
