use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn double(num: u32) -> u32 {
    2 * num
}