export class Random
{

    static Range(min: number, max: number) : number
    {
        let rand = Math.random() * (max - min) + min;
        if (Random.isFloat(min) || Random.isFloat(max))
            return rand;
        else
            return Math.floor(rand)
    }

    static isInt(n: number): boolean
    {
        return Number(n) === n && n % 1 === 0;
    }
    
    static isFloat(n: number): boolean
    {
        return Number(n) === n && n % 1 !== 0;
    }
};