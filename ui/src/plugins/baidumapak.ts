import { IApi } from 'umi';
 
export default (api: IApi) => {
  api.describe({
    key: 'baidumapAk',
    config: {
      schema(joi) {
        return joi.string();
      },
    },
  });
  
  api.addHTMLHeadScripts(() => {
    return {
      src: '//api.map.baidu.com/api?type=webgl&v=1.0&ak=jzrHGS4Ut6YUrG2EnMMNhpYGGm3aggOZ',
      type:'text/javascript'
    }
  })
  api.addHTMLHeadScripts(() => {
    return {
      src: '//api.map.baidu.com/library/TrackAnimation/src/TrackAnimation_min.js',
      type:'text/javascript'
    }
  })
};