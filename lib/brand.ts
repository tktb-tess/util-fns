type Brand<in out K extends symbol> = {
    [key in K]: K;
}


export default Brand;