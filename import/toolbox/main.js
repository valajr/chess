const whenLoadList = [];
_docLoad = setInterval((f)=>{if(document.readyState != "complete")return;clearInterval(_docLoad);delete _docLoad;f()},1,()=>{
    for(let event in whenLoadList) {
        whenLoadList[event]();
    };
});

function documentReady(f){
    whenLoadList.push(f);
}