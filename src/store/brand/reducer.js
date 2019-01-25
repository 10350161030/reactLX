import * as brand from './action-type';
import Immutable from 'immutable';

let defaultData = {
    /**
     * 商品数据
     * @type {Array}
     * example: [{
     *    product_id: 1, 商品ID 
     *    product_name: "PaiBot（2G/32G)", 商品名称
     *    product_price: 2999, 商品价格
     *    commission: 200, 佣金
     *    selectStatus: false, 是否选择
     *    selectNum: 0, 选择数量
     * }]
     */
    brandDataList: {
        "isHandMovement": true,
        /*是否手动填写车辆信息*/
        "province": "粤",
        /*省份*/
        "carNumber": "",
        "frameNumber": "",
        /*车架好*/
        "engineNumber": "",
        /*发动机号*车品牌id*/

        "isHandType": "",
        "confirmType": "",
        "bindStatus": "",

        "brandName": "",
        "seriesName": "",
        "modeName": "",
        "brandImage": "",
        "brandId": "",
        "seriesId": "",
        "modelId": "",


        "carId": "",
        "dateOfIssue": "",
        /*行驶证日期*/
        "drivingLicenseEndDate": "",
        /*驾驶证*/
        "insuranceStartDate": ""
        /*保险*/
    },
    brandDataError: {},
    brandState: false,
    seriesState: false,
    modeState: false,

}

export const brandData = (state = defaultData, action) => {
    let imuDataList;
    let imuItem;
    switch (action.type) {
        case brand.GETCARINFO:
             console.log(action)
            return { ...state,
                ...action
            }
        case brand.CHANGEBRANDZJSTATE:
            console.log("改变组件触发");
            return { ...state,
                ...action
            }
        case brand.BRANDACT:
            console.log("改变品牌状态触发");
            // 车品牌选择方法
            /* 
                brandDataList.brandName
                brandDataList.brandImage
                brandDataList.brandId

                action等于
                brandId:id,
                brandName:name,
                brandImage:img,
            */
            /* 拿到原始数据 */

            imuItem = Immutable.Map(state.brandDataList);
            imuItem = imuItem.set('brandId', action.brandId);
            imuItem = imuItem.set('brandName', action.brandName);
            imuItem = imuItem.set('brandImage', action.brandImage);
            // redux必须返回一个新的state
            return { ...state,
                ...{
                    brandDataList: imuItem.toJS()
                }
            };
        case brand.SERIESACT:
            // 车型选择方法
            imuItem = Immutable.Map(state.brandDataList);
            imuItem = imuItem.set('seriesId', action.seriesId);
            imuItem = imuItem.set('seriesName', action.seriesName);
            return { ...state,
                ...{
                    brandDataList: imuItem.toJS()
                }
            };
        case brand.MODEACT:
            // 车系选择方法
            imuItem = Immutable.Map(state.brandDataList);
            imuItem = imuItem.set('modeId', action.modeId);
            imuItem = imuItem.set('modeName', action.modeName);
            return { ...state,
                ...{
                    brandDataList: imuItem.toJS()
                }
            };
        case brand.SAVEFORMDATA:
            imuItem = Immutable.Map(state.brandDataList);
            imuItem = imuItem.set(action.datatype, action.value);
            return { ...state,
                ...{
                    brandDataList: imuItem.toJS()
                }
            };
        default:
            return state;
    }
}