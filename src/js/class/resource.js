import Race from './race'
import Devil from './devil'
import Skill from './skill'
import SkillType from './skill_type'
import SwordShieldType from "./sword_shield_type";
import SwordShield from "./sword_shield";

class Resource{

    constructor(devil_raw_data, skill_raw_data, sword_shield_raw_data){

        this.races = [];
        this.devils = [];
        this.skillTypes = [];
        this.skills = [];
        this.swordShields = [];
        this.swordShieldTypes = [];

        let race_data = {};
        let devil_data = {};
        let devil_array = [];
        let type_data = {};
        let skill_data = {};
        let sword_shield_data = {};
        let sword_shield_type = {};
        //Race & Devil

        // console.log("更改前：");
        // console.log(devil_raw_data);
        // console.log(this.races);

        devil_raw_data = devil_raw_data.map( race => {
            race.devils = race.devils.map( devil => {
                return devil_data[devil.name] = new Devil(devil);
            });
            return race_data[race.name] = new Race(race);
        });

        console.log("惡魔類型數據：");
        // console.log(devil_raw_data);
        console.log(race_data);

        console.log("惡魔數據：");
        console.log(devil_data);

        sword_shield_raw_data = sword_shield_raw_data.map( types => {
            types.swordShields = types.swordShields.map( ss => {
                console.log("每个剑盾数据：");
                console.log(ss);
                return sword_shield_data[ss.name] = new SwordShield(ss);
            });
            return sword_shield_type[types.name] = new SwordShieldType(types);
        });

        console.log("劍盾類型數據：\n");
        // console.log(devil_raw_data);
        console.log(sword_shield_type);
        //Skill Type & Skill

        skill_raw_data = skill_raw_data.map( type => {
            type = new SkillType(type);
            type.skills = type.skills.map( skill => {
                skill = new Skill(skill);
                skill.type = type;
                return skill_data[skill.name] = skill;
            });
            return type_data[type.name] = type;
        });

        console.log("剑盾数据：");
        console.log(sword_shield_raw_data);
        // sword_shield_raw_data = sword_shield_raw_data.map( type =>{
        //     type = new SwordShieldType(type);
        //     type.swordShields = type.swordShields.map( swordShield => {
        //         swordShield = new Sword_shield(swordShield);
        //         skill.type = type;
        //         return sword_shield_data[swordShield.name] = swordShield;
        //     });
        //     return
        // });

        //Details

        devil_raw_data.forEach( race => {

            //Race
            race.formulas.forEach( formula => {
                formula[0] = race_data[formula[0]];
                formula[1] = race_data[formula[1]];
            });

            //Devil
            race.devils.forEach( devil => {

                devil.race = race;

                if(devil.source=='multi_fusion'){
                    devil.formula = devil.formula.map(name=>{
                        return devil_data[name];
                    });
                }

                [devil.skills,devil.skill4,devil.skill5] =
                [devil.skills,devil.skill4,devil.skill5].map( skill_list => {
                    return skill_list.map( name => {
                        return skill_data[name]
                            ? skill_data[name].addDevil(devil)
                            : new Skill({name:name});
                    });
                });
            });

            //devil's fusion property

            let devils_with_fusion = race.devils.filter(d=>d.fusion&&d.source=='normal_fusion');

            devils_with_fusion.forEach( (devil, index) => {

                devil.max = devil.grade;
                devil.min = (index==devils_with_fusion.length-1 ? 0 : devils_with_fusion[index+1].grade);
            });
        });

        //Race's usage (fusion options)

        devil_raw_data.forEach( r1 => {

            let usage_temp = {};

            devil_raw_data.forEach( r0 => {
                r0.formulas.forEach( f => {

                    let r2 = f[0].name == r1.name ? f[1] : (f[1].name == r1.name ? f[0] : null) ;

                    if( ! r2 ) return;

                    usage_temp[r0.name] = (r0.name in usage_temp)
                        ? usage_temp[r0.name].concat(r2)
                        : [r2] ;
                });
            });

            r1.usage = [];

            Object.keys(usage_temp).forEach(name => {
                r1.usage.push({r0:race_data[name],r2s:usage_temp[name]});
            });
        });

        //devil's fission options

        devil_array = Object.values(devil_data).sort( (d1,d2) => (d1.grade - d2.grad2) );

        devil_array.forEach( devil => {
            devil.fission_options = devil.fission_formulas();
            devil.fission_boms = devil.fission_options.flatMap( option => option.boms );
        });

        let break_limit=10;
        let all_pass = false;

        while( break_limit-- > 0 && !all_pass){

            all_pass = true;

            devil_array.forEach( devil => {

                let pass = true;

                for(let rarity=1; rarity<=5; rarity++){

                    let cost = null;
                    let pure_cost = null;

                    if(devil.fission_boms.length){

                        devil.fission_boms.forEach( bom => {

                            if(!bom.auto)
                                return ;

                            let l_pure_cost = bom.getCostPure(rarity);

                            if(l_pure_cost==null) pass = false;
                            else if(pure_cost==null) pure_cost = l_pure_cost;
                            else pure_cost = pure_cost > l_pure_cost ? l_pure_cost : pure_cost;

                            let l_cost = bom.getCost(rarity);

                            if(l_cost==null)    pass = false;
                            else if(cost==null) cost = l_cost;
                            else                cost = cost > l_cost ? l_cost : cost;
                        });

                        if(devil.rarity > rarity){

                            if(pure_cost!=null && devil.pure_costs[rarity] != pure_cost){
                                devil.pure_costs[rarity] = pure_cost;
                                pass = false;
                            }

                            if(cost!=null && devil.costs[rarity] != cost){
                                devil.costs[rarity] = cost;
                                pass = false;
                            }
                        }
                        else{
                            devil.pure_costs[rarity] = 0;
                            devil.costs[rarity] = 0;
                        }
                    }
                    else{
                        devil.pure_costs[rarity] = 0;
                        devil.costs[rarity] = 0;
                    }
                }

                if(!pass)   all_pass = false;
            });
        }

        this.races = devil_raw_data;
        this.race_data = race_data;

        this.devils = devil_array;
        this.devil_data = devil_data;

        this.skillTypes = skill_raw_data;
        this.skill_data = skill_data;
        console.log("技能数据：");
        console.log(skill_data);
        this.skills = Object.values(skill_data);

        this.swordShieldTypes = sword_shield_type;
        this.swordShields = sword_shield_data;
    }
}

export default Resource;
