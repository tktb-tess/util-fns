import { isNode } from "../dist/bundle";

const app = document.getElementById('app')!;

app.innerHTML = `
<p>Hello, Vite!, ${isNode()}</p>
`;
