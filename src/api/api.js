import Server from './server';

class API extends Server {


    /**
     *  用途：判断是否登录
     *  @url https://www.easy-mock.com/mock/5c2d6b92410de05f5d0de661/user/01 5c2d6b92410de05f5d0de661/person/isUserLogin
     *  返回status为1表示成功
     *  @method post
     *  @return {promise}
     */
    async isUserLogin(params = {}) {
        try {
            let result = await this.axios('post', '/person/isUserLogin', params);
            return result;
        } catch (err) {
            throw err;
        }
    }


    /**
     *  用途：新用户领取成功
     *  @url https://www.easy-mock.com/mock/5c2d6b92410de05f5d0de661/user/015c2d6b92410de05f5d0de661/person/isUserLogin
     *  返回status为1表示成功
     *  @method post
     *  @return {promise}
     */
    async newGitFlowFun(params = {}) {
        try {
            let result = await this.axios('post', '/user/01/welfare', params);
            return result;
        } catch (err) {
            throw err;
        }
    }



    /**
     *  用途：获取微信个人信息、及卡号等
     *  @url https://api.cangdu.org/shopro/data/record
     *  返回http_code为200表示成功
     *  @method post
     *  @return {promise}
     */
    async getWXpsoninfo(params = {}) {
        try {
            let result = await this.axios('post', `/01/one/getpersoninf`);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     *  用途：注册账号
     *  @url https://api.cangdu.org/shopro/data/products
     *  返回http_code为200表示成功
     *  @method post
     *  @return {promise}
     */
    async registerSubmit(params = {}) {
        try {
            let result = await this.axios('post', '/user/01/register', params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     *  用途：用户登录接口
     *  @url https://api.cangdu.org/shopro/data/balance
     *  返回http_code为200表示成功
     *  @method post
     *  @return {promise}
     */
    async loginSubmit(params = {}) {
        try {
            let result = await this.axios('post', '/user/01/userLogin', params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     *  用途：发送验证码接口
     *  @url https://api.cangdu.org/shopro/data/balance
     *  返回http_code为200表示成功
     *  @method post
     *  @return {promise}
     */
    async verifyCode(params = {}) {
        try {
            let result = await this.axios('post', '/code/01/verifyCode', params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /**
     *  用途：头像上传接口
     *  @url https://api.cangdu.org/shopro/data/balance
     *  返回http_code为200表示成功
     *  @method post
     *  @return {promise}
     */
    async modifyFun(params = {}) {
        try {
            let result = await this.axios('post', '/user/01/modify', params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /* 获取身份证照片上传状态 */
    async getIDimgState(params = {}) {
        try {
            let result = await this.axios('post', '/picture/01/getIdImgState', params);
            return result;
        } catch (err) {
            throw err;
        }
    }
    /* 获取驾驶证照片上传状态 */
    async getCarImgState(params = {}) {
        try {
            let result = await this.axios('post', '/picture/01/getCarImgState', params);
            return result;
        } catch (err) {
            throw err;
        }
    }
    /* 上传图片接口 */
    async uqdataPaperImg(params = {}) {
        try {
            let result = await this.axios('post', '/picture/01/certificates', params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /* 上传图片接口 */
    async getIDInfo(params = {}) {
        try {
            let result = await this.axios('post', '/picture/01/getIDInfo', params);
            return result;
        } catch (err) {
            throw err;
        }
    }
    /* 获取总车辆详情信息数据 */
    async getCarDetailInof(params = {}) {
        try {
            let result = await this.axios('post', '/user/01/getcarinfo', params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /* 获取车品牌信息 */
    async getbrandInfo(params = {}, seriesParams, modeParams) {
        try {
            let result = await this.axios('get', '/vehicle/modelInfo/brand/' + seriesParams + '/' + modeParams, params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /* 提交车辆信息 */
    async submitcarInfo(params = {}, seriesParams, modeParams) {
        try {
            let result = await this.axios('post', '/vehicle/modify', params);
            return result;
        } catch (err) {
            throw err;
        }
    }

    /* 获取历史轨迹日期 */
    async getDateList(params = {}, seriesParams, modeParams) {
        try {
            let result = await this.axios('post', '/track/01/queryTrackDateList', params);
            return result;
        } catch (err) {
            throw err;
        }
    }
    /* 获取历史分段轨迹 */
    async gethistoryList(params = {}, seriesParams, modeParams) {
        try {
            let result = await this.axios('post', '/track/01/queryTrackAnalysis', params);
            return result;
        } catch (err) {
            throw err;
        }
    }
    /* 获取选中地图轨迹 */
    async getHistoryDetaliList(params = {}, seriesParams, modeParams) {
        try {
            let result = await this.axios('post', '/trackInfo/querySpecifyTimePeriod', params);
            return result;
        } catch (err) {
            throw err;
        }
    }


}

export default new API();