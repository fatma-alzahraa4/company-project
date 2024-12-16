export const paginationFunc = ({page=1,size=5})=>{
    if(page<0){page = 1}
    if(size<0){size = 5}
    const limit = size;
    const skip = (page-1)*limit
    return {limit,skip}
}