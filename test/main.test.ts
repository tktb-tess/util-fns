import { PCGMinimal } from '../src/main';

const pcgRng = new PCGMinimal(PCGMinimal.getSeed());

for (let i = 0; i < 10; i++) {
    console.log(pcgRng.getBoundedRand(256));
}
