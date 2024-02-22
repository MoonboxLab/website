
"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Form, Input, InputNumber, Select, } from "antd"
import { useSize } from "ahooks"
import { useLocale, useTranslations } from "next-intl"
import clsx from "clsx"
import { useAccount, useSignMessage } from "wagmi"
import { Loader2 } from "lucide-react"
import { PostFormInfo } from "@/service/goldcard"
import { toast } from "react-toastify"
import { FormStage } from "./page"

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select className=" h-[40px] md:h-[48px]" style={{ width: 100 }}>
      <Select.Option value="86">+86</Select.Option>
      <Select.Option value="87">+87</Select.Option>
    </Select>
  </Form.Item>
);

interface AddressFormParams {
  nonce: string
  setCurrentStage: Dispatch<SetStateAction<FormStage>>
  setDefaultFormValues: Dispatch<SetStateAction<Record<string, any>>>
  defaultFormValues: Record<string, any>
  querySignNonce: (address: string) => Promise<void>
}
export default function AddressForm(props: AddressFormParams) {
  const { nonce, setCurrentStage, setDefaultFormValues, defaultFormValues, querySignNonce } = props
  const t = useTranslations('GoldCard.Form');
  const locale = useLocale()

  const {address} = useAccount()

  const [readySubmit, setReadySubmit] = useState<boolean>(false)
  const [form] = Form.useForm();

  const [formLoading, setFormLoading] = useState<boolean>(false)

  const mediaSize = useSize(document.querySelector('body'));

  const { signMessageAsync } = useSignMessage({ message: nonce})

  const handleSubmitForm = async () => {
    await form.validateFields()

    try {
      setFormLoading(true)
      console.log(form.getFieldsValue())
      // 签名
      const signStr =  await signMessageAsync();
      // 提交表单

      const {address: deliverAddress, email, phone, prefix, userid, username}  = form.getFieldsValue()

      const formParams = {
        addressee: username,
        deliverAddress,
        email,
        idNumber: userid || "",
        sign: signStr,
        telNumber: `(${prefix}) ${phone}`,
        userAddress: address
      }

      const result = await PostFormInfo(formParams)
      if (result['success']) {
        setDefaultFormValues(form.getFieldsValue())
        setCurrentStage(FormStage.End)

        querySignNonce(address as `0x${string}`)
      } else {
        toast.error(result['msg'])
      }
    } catch (err) {

    }

    setFormLoading(false)
  }

  const handleValueChange = (changedVal: any, allVals: any) => {
    console.log(allVals)
    if (
      allVals['username'] && allVals['phone'] && allVals['address'] && allVals['email']
    ) {
      setReadySubmit(true)
    } else {
      setReadySubmit(false)
    }
  }

  return <div className=" px-[20px] md:px-0">
    <h3 className=" text-[30px] leading-[36px] md:text-[40px] font-semibold md:leading-[40px] text-center mt-[30px] md:mt-[80px]" dangerouslySetInnerHTML={{ __html: t.raw("title") }}></h3>
    <p className={clsx(
      " md:text-[24px] font-semibold leading-[24px] text-center  md:mx-[60px] mt-[10px] md:mt-[20px] mb-[40px] md:mb-[80px]",
      locale == 'en' ? "mx-[0px] text-[18px]" : "text-[21px] mx-[30px]"
    )}>{t("subTitle")}</p>

    <Form
      form={form}
      layout={(mediaSize?.width || 0) < 768 ? "vertical" : "horizontal"}
      onValuesChange={handleValueChange}
      name="addressform"
      labelCol={(mediaSize?.width || 0) < 768 ? {} : { flex: '100px', }}
      labelAlign="left"
      colon={false}
      style={{ maxWidth: 580, margin: "auto", fontSize: '18px' }}
      initialValues={defaultFormValues}
      size={(mediaSize?.width || 0) < 768 ? "middle" : "large"}
    >
      <Form.Item label={<span className=" text-[16px] font-medium md:text-[18px] md:font-semibold leading-[18px]">{t("formName")}</span>} name="username" rules={[{ required: true }]} className=" ">
        <Input size="large" />
      </Form.Item>

      <Form.Item label={<span className=" text-[16px] font-medium md:text-[18px] md:font-semibold leading-[18px]">{t("formPhone")}</span>} name="phone" rules={[{ required: true, }]} >
        <Input size="large" className="" type="tel" addonBefore={prefixSelector} />
      </Form.Item>

      <Form.Item label={<span className=" text-[16px] font-medium md:text-[18px] md:font-semibold leading-[18px]">{t("formAddress")}</span>} name="address" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item label={<span className=" text-[16px] font-medium md:text-[18px] md:font-semibold leading-[18px]">{t("formEmail")}</span>} name="email" rules={[{ required: true }]}>
        <Input size="large" className="" type="email" />
      </Form.Item>

      <Form.Item label={<span className=" text-[16px] font-medium md:text-[18px] md:font-semibold leading-[18px]">{t("formIdNumber")}</span>} name="userid" rules={[{ required: false }]} help={<span className=" text-[14px] font-normal pt-[10px] text-[rgba(255,0,6,1)]">{t("idTip")}</span>}>
        <Input size="large" />
      </Form.Item>
    </Form>
    <br />
    <br />
    <br className=" hidden md:block" />
    {
      readySubmit ?
        <div className={clsx(
          " mb-[40px] md:mb-0 md:ml-[160px] w-full h-[48px] rounded-[12px]  bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[18px] xl:text-[18px] leading-[18px] xl:leading-[18px] font-semibold select-none", locale == 'en' ? "md:w-[200px]" : "md:w-[180px]"
        )} onClick={handleSubmitForm} >
          { formLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t("btnSubmit")}
        </div>
        :
        <div className=" mb-[40px] md:mb-0 md:ml-[160px] w-full h-[48px] md:w-[180px] rounded-[12px]  bg-white border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex justify-center items-center text-[18px] xl:text-[18px] leading-[18px] xl:leading-[18px] font-semibold select-none opacity-30" >
          {t("btnSubmit")}
        </div>
    }
  </div>
}
