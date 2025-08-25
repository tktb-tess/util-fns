import { PCGMinimal } from '../dist/bundle';
const app = document.getElementById('app')!;

const rng = new PCGMinimal(PCGMinimal.getSeed());
const arr = Array.from(rng.genRands(1000)).map((n) => n.toString(16).padStart(8, '0')).join('\n');

app.innerHTML = `
<pre>${arr}</pre>
`;
