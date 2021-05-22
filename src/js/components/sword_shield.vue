<template>
  <b-card no-body class="border-secondary">
    <b-card-body class="p-0" @click="click">
      <div v-if="!(usage=='builder'&&source=='multi_fusion')" class="p-2" :style="{backgroundImage:'url(\'public/images/devil/'+devil.icon+'\')',cursor:(usage=='fission'||usage=='builder')?'pointer':''}"
           style="background-position:right;background-repeat:no-repeat;background-size:contain">
        <div class="font-weight-bold text_shadow">
          {{usage=='fusion'||usage=='fission'||usage=='info'?devil.race.showName():''}} {{ devil.showName() }}
        </div>
        <div class="small">
          <span class="text_shadow">{{ devil.showGrade() }} {{ devil.showRarity() }}</span>
          <span class="ml-2" v-if="usage=='info'">AI: {{ $t('devil.'+devil.type) }}</span>
        </div>
      </div>
    </b-card-body>

    <b-card-footer class="p-1" v-if="usage=='fission'">
      <slot></slot>
      <b-button variant="info" size="sm" @click.stop="info()" class="font-weight-bold small">⚝</b-button>
    </b-card-footer>

  </b-card>
</template>

<script>
export default {
  name:'swordShield',
  props:['swordShield','usage','skill','source'],
  methods:{
    listen:function(res){

      this.$emit('listen', res);
    },
    click:function()
    {
      if(this.usage=='fission')
      {
        if(this.devil.fusion)
          this.listen({name:'start_bom', value:this.devil});
      }

      if(this.usage=='builder')
      {
        if(this.devil.fusion)
          this.listen({name:'list_bom', value:null});
      }

    },
    info:function(){

      this.listen({name:'info', value:this.devil});
    },
  }
}
</script>
