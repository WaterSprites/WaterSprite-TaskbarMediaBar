// Copyright 2026 WaterSprites. MIT.
import {ref,watch,type Ref} from 'vue';
import {useMutationObserver} from '@vueuse/core';
export function useComputedStyle(element:Ref<HTMLElement|undefined>){
 const value=ref<CSSStyleDeclaration>(),update=()=>{value.value=element.value?getComputedStyle(element.value):undefined};
 watch(element,update,{flush:'post',immediate:true});
 useMutationObserver(element,update,{attributes:true,attributeFilter:['class','style']});
 return value;
}
