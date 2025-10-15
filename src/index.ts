import { basekit, FieldType, field, FieldComponent, FieldCode, Authorization, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm, 'api.exchangerate-api.com',]);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      // 'zh-CN': {
      //   'test': '测试',
      // },
      // 'en-US': {
      //   'test': 'Test',
      // },
      // 'ja-JP': {
      //   'test': '為替',
      // },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      component: FieldComponent.Input,
      validator: {
        required: true,
      },
      tooltips: [{
        type: 'text',
        content: '在此输入生图指令(prompt)，可以引用表格中的其他字段'
      }],
      key: 'textPrompt',
      label: '生图指令',
      props: {},
      defaultValue: '在此输入生图指令(prompt)，可以引用表格中的其他字段',
    },
    {

      component: FieldComponent.FieldSelect,
      validator: {
        required: false,
      },
      tooltips: [{
        type: 'text',
        content: '选择一个附件类型的列，该列内容是参考图片'
      }],
      key: 'referenceImage',
      label: '参考图片',
      props: {
        supportType: [FieldType.Attachment],
      },
      defaultValue: undefined,
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Attachment,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { textPrompt: string, referenceImage?: any }, context) => {
    const { textPrompt, referenceImage } = formItemParams;
    console.log('===formItemParams', formItemParams, '===context', context);
    
    try {
      // 如果有参考图片，且是图片类型，直接返回参考图片
      if (referenceImage && referenceImage.length > 0) {
        const image = referenceImage[0]; // 取第一个附件
        
        // 检查是否是图片类型
        const isImage = image.type && image.type.startsWith('image/');
        
        if (isImage) {
          return {
            code: FieldCode.Success,
            data: [{
              name: image.name || `reference_image_${Date.now()}.png`,
              content: image.tmp_url,
              contentType: "attachment/url" as const,
              width: 512,
              height: 512
            }]
          }
        } else {
          console.log('参考附件不是图片类型:', image.type);
        }
      }
      
      // 如果没有参考图片，使用默认逻辑生成图片
      return {
        code: FieldCode.Success,
        data: [{
          name: `generated_image_${Date.now()}.png`,
          content: `https://github.githubassets.com/favicons/favicon.png`,
          contentType: "attachment/url" as const,
          width: 512,
          height: 512
        }]
      }
    } catch (e) {
      console.log('====error', String(e));
      return {
        code: FieldCode.Error,
        data: []
      }
    }
  },
});
export default basekit;