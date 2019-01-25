import * as brand from './action-type';
import API from '@/api/api';

// 初始化获取车品牌数据，保存至redux
export const getBrandData = () => {
    // 返回函数，异步dispatch
    return async dispatch => {
        try {
            let result = await API.getCarDetailInof();
            if (result.code == "CD000001") {
                dispatch({
                    type: brand.GETCARINFO,
                    brandDataList: result.body,
                })
            } else {
                dispatch({
                    type: brand.GETCARINFO,
                    brandDataError: result,
                })
            }
        } catch (err) {
            let result={
                msg:"服务器异常",
            }
            console.log(2222);
            dispatch({
                type: brand.GETCARINFO,
                brandDataError: result,
            })
        }
    }
}

// 保存表单数据
export const saveFormData = (value, datatype) => {
    return {
        type: brand.SAVEFORMDATA,
        value,
        datatype,
    }
}


// 修改车品牌选择状态
export const brandZJState = (brandState, seriesState, modeState) => {
    return async dispatch => {
        dispatch({
            type: brand.CHANGEBRANDZJSTATE,
            brandState,
            seriesState,
            modeState,
        })
    }
}

// 修改车品牌选id及name brand
export const brandActFun = (id, name, img) => {
    return async dispatch => {
        dispatch({
            type: brand.BRANDACT,
            brandId: id,
            brandName: name,
            brandImage: img,
        })
    }
}



// 修改车型 id及name series
export const seriesActFun = (id, name) => {
    return async dispatch => {
        dispatch({
            type: brand.SERIESACT,
            seriesId: id,
            seriesName: name,
        })
    }
}
// 修改车系 id及name mode
export const modeActFun = (id, name) => {
    return async dispatch => {
        dispatch({
            type: brand.MODEACT,
            modeId: id,
            modeName: name,
        })
    }
}