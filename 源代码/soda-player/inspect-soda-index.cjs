const fs=require('fs'),path=require('path');const {Unpackr}=require('msgpackr');
const file=path.join(process.env.APPDATA,'SodaMusic/LunaCacheV2/entries.db'),data=fs.readFileSync(file),marker=Buffer.from('d47240','hex');let decoded=0,lyrics=0,printed=0;
for(let at=data.indexOf(marker);at>=0;at=data.indexOf(marker,at+3)){
 try{let record;new Unpackr({mapsAsObjects:true}).unpackMultiple(data.subarray(at),value=>{record=value;return false});if(!record?.info)continue;decoded++;const md=record.info.mediaDetail;if(md?.lyrics){lyrics++;if(printed++<3)console.log(JSON.stringify({recordKeys:Object.keys(record),detailKeys:Object.keys(md),lyricType:typeof md.lyrics,lyricKeys:Object.keys(md.lyrics),lyricCharacters:md.lyrics.content?.length||0,playableKeys:Object.keys(md.playable||{}),trackKeys:Object.keys(md.playable?.track||{})}))}}
 catch{}
}
console.log({decoded,lyrics});
