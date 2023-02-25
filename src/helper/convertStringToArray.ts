export const convertStringToArray = (value:string):string[] => {
    const tmp1 = value.replace(/^(\"|\')|(\"|\')$|^\[\s*(\'|\")\s*|\s*(\'|\")\s*\]\s*$/ig,"")
    const tmp2 = tmp1.replace(/\s*(\'|\")\s*\,\s*(\'|\")\s*/ig,",")
    const tmp3 = tmp2.replace(/\s+\,|\,\s+/ig," ")
    const tmp4 = tmp3.split(",")
    return tmp4
}