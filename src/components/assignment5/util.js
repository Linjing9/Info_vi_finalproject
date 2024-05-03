import { groups } from "d3";

export function buildTree( data, attributes ){
    //data: a list of objects, loaded from backend
    //attributes: the attributes that define the hierarchy 
    let itemArr = [];
    if (attributes.length === 0){
        return null;
    }
    let g = groups(data, d => d[attributes[0]]);
    let levels = g.map( d => d[0]);
    // console.log(levels);
    for (let i = 0; i < levels.length; i++) {
        let infections = g[i][1].map(d => d.symptomatic + d.asymptomatic).reduce((sum, d) => sum+d, 0);
        let symptomatic = g[i][1].map(d => d.symptomatic).reduce((sum, d) => sum+d, 0);
        let asymptomatic = g[i][1].map(d => d.asymptomatic).reduce((sum, d) => sum+d, 0);
        itemArr.push({name: levels[i], children: buildTree(g[i][1], attributes.slice(1)),
                infections: infections, symptomatic: symptomatic, asymptomatic: asymptomatic, group: g[i][1]});
    } 
    return itemArr; 
}