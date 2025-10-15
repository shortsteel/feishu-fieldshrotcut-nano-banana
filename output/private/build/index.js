"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'api.exchangerate-api.com',]);
block_basekit_server_api_1.basekit.addField({
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
        // 'zh-CN': {
        //   'rmb': '人民币金额',
        //   'usd': '美元金额',
        //   'rate': '汇率',
        // },
        // 'en-US': {
        //   'rmb': 'RMB Amount',
        //   'usd': 'Dollar amount',
        //   'rate': 'Exchange Rate',
        // },
        // 'ja-JP': {
        //   'rmb': '人民元の金額',
        //   'usd': 'ドル金額',
        //   'rate': '為替レート',
        // },
        }
    },
    // 定义捷径的入参
    formItems: [
        {
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
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
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            defaultValue: undefined,
        },
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Attachment,
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
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
                        code: block_basekit_server_api_1.FieldCode.Success,
                        data: [{
                                name: image.name || `reference_image_${Date.now()}.png`,
                                content: image.tmp_url || image.content,
                                contentType: "attachment/url",
                                width: 512,
                                height: 512
                            }]
                    };
                }
                else {
                    console.log('参考附件不是图片类型:', image.type);
                }
            }
            // 如果没有参考图片，使用默认逻辑生成图片
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: [{
                        name: `generated_image_${Date.now()}.png`,
                        content: `https://github.githubassets.com/favicons/favicon.png`,
                        contentType: "attachment/url",
                        width: 512,
                        height: 512
                    }]
            };
        }
        catch (e) {
            console.log('====error', String(e));
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                data: []
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBOEk7QUFDOUksTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLDBCQUEwQixFQUFFLENBQUMsQ0FBQztBQUVsRSxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLGdCQUFnQjtJQUNoQixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUU7UUFDUixhQUFhO1FBQ2Isb0JBQW9CO1FBQ3BCLG1CQUFtQjtRQUNuQixrQkFBa0I7UUFDbEIsS0FBSztRQUNMLGFBQWE7UUFDYix5QkFBeUI7UUFDekIsNEJBQTRCO1FBQzVCLDZCQUE2QjtRQUM3QixLQUFLO1FBQ0wsYUFBYTtRQUNiLHFCQUFxQjtRQUNyQixtQkFBbUI7UUFDbkIscUJBQXFCO1FBQ3JCLEtBQUs7U0FDTjtLQUNGO0lBQ0QsVUFBVTtJQUNWLFNBQVMsRUFBRTtRQUNUO1lBQ0UsU0FBUyxFQUFFLHlDQUFjLENBQUMsS0FBSztZQUMvQixTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7YUFDZjtZQUNELFFBQVEsRUFBRSxDQUFDO29CQUNULElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRSwrQkFBK0I7aUJBQ3pDLENBQUM7WUFDRixHQUFHLEVBQUUsWUFBWTtZQUNqQixLQUFLLEVBQUUsTUFBTTtZQUNiLEtBQUssRUFBRSxFQUFFO1lBQ1QsWUFBWSxFQUFFLCtCQUErQjtTQUM5QztRQUNEO1lBRUUsU0FBUyxFQUFFLHlDQUFjLENBQUMsV0FBVztZQUNyQyxTQUFTLEVBQUU7Z0JBQ1Qs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