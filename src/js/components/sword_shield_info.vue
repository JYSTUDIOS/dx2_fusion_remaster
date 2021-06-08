<template>
  <b-modal size="lg" hide-header ok-only ok-title="CLOSE" ok-variant="secondary" footer-class="py-2" :id="id">

    <div v-if="info_devil">
      <div class="row justify-content-center">

        <div class="col-12">
          <devil :devil="info_devil" usage="info"></devil>
        </div>

        <div class="col-12 mt-2">
          <table class="table table-sm table-bordered table-sm my-0">
            <tbody>
            <tr class="text-center">
              <th v-for="(ele, index) in elements" :style=" ele.style " :key="index">{{ $t( ele.slug ) }}</th>
            </tr>
            <tr class="text-center">
              <td width="14%" v-for="(ele,index) in info_devil.elements" :key="index">
                <div class="py-1">
                  <span class="font-weight-bold" :class="{'text-primary':(ele=='nu'||ele=='rp'||ele=='dr'),'text-danger':ele=='wk'}">{{ ele ? $t('element.'+ele) : 'ー' }}</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="col-12 mt-2">
          <table class="table table-sm table-bordered my-0">
            <tbody>
            <tr>
              <td width="30%" class="text-center align-middle font-weight-bold">{{ $t('message.sword_shield_skills') }}</td>
              <td>
                <div v-for="(skill, index) in info_devil.skills" :key="index">
                  <span class="pl-4 small" :class="{'skill_only':index==0}" v-b-popover.hover.top="skill.showHint()">{{skill.showName()}}</span>
                </div>
              </td>
            </tr>
            <tr v-for="(type, index) in panel" :style=" type.bar_style " :key="index">
              <td class="text-center align-middle">
                <h4><b-badge class="text-white" :style=" type.style ">{{ $t( type.slug ) }}</b-badge></h4>
              </td>
              <td>
                <span class="pl-4 skill_lock small" >{{ info_devil.panels[index].showPanel(index) }}</span><br>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>

  </b-modal>
</template>

<script>
import {mapState} from '../utility/store'
import swordShield from './sword_shield.vue'

export default {

  components:{
    'swordShield': swordShield
  },
  props:['id'],
  data:function(){
    return{

      panel:[
        {slug:'panel.panel1','style':{'background-image':'linear-gradient(#4a545b , #8e989f)'}, 'bar_style':{'background-image':'linear-gradient(to right, white , #e5eaee)'} },
        {slug:'panel.panel2','style':{'background-image':'linear-gradient(#4a545b , #8e989f)'}, 'bar_style':{'background-image':'linear-gradient(to right, white , #e5eaee)'} },
        {slug:'panel.panel3','style':{'background-image':'linear-gradient(#4a545b , #8e989f)'}, 'bar_style':{'background-image':'linear-gradient(to right, white , #e5eaee)'} },
      ],
      elements:[
        {slug:'element.phys','style':{'background-color':'rgb(185, 185, 185)'}}, //0:物
        {slug:'element.fire','style':{'background-color':'rgb(219, 120, 120)'}}, //1:火
        {slug:'element.ice','style':{'background-color':'rgb(150, 220, 230)'}}, //2:冰
        {slug:'element.elec','style':{'background-color':'rgb(233, 230, 64)'}}, //3:雷
        {slug:'element.force','style':{'background-color':'rgb(133, 240, 156)'}}, //4:衝
        {slug:'element.light','style':{'background-color':'rgb(240, 236, 196)'}}, //5:破
        {slug:'element.dark','style':{'background-color':'rgb(218, 142, 221)'}} //6:咒
      ],
    }
  },
  computed:{
    ...mapState(['info_sword_shield'])
  }
}
</script>
