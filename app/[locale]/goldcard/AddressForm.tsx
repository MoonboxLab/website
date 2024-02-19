
"use client"

// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, Input, InputNumber, Select, } from "antd"
// import { Button } from "@/components/ui/button"


const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select className=" h-[48px]" style={{ width: 100 }}>
      <Select.Option value="86">+86</Select.Option>
      <Select.Option value="87">+87</Select.Option>
    </Select>
  </Form.Item>
);

export default function AddressForm() {

  const [readySubmit, setReadySubmit] = useState<boolean>(false)
  const [form] = Form.useForm();


  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const handlePreCheck = async () => {
    await form.validateFields()

    // 签名


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

  return <div>
    <h3 className=" text-[40px] font-semibold leading-[40px] text-center mt-[80px]">恭喜你抽中金卡</h3>
    <p className=" text-[24px] font-semibold leading-[24px] text-center mt-[20px] mb-[80px]">請填寫收件訊息，我們將統一郵寄簽名金卡</p>


    <Form
      form={form}
      onFinish={onFinish}
      onValuesChange={handleValueChange}
      name="addressform"
      labelCol={{ flex: '100px', }}
      labelAlign="left"
      wrapperCol={{ flex: 1 }}
      colon={false}
      style={{ maxWidth: 580, margin: "auto", fontSize: '18px' }}
      initialValues={{ prefix: "86" }}
      size="large"
    >
      <Form.Item label={<span className="text-[18px] font-semibold leading-[18px]">姓名</span>} name="username" rules={[{ required: true }]} className=" ">
        <Input size="large" />
      </Form.Item>

      <Form.Item label={<span className="text-[18px] font-semibold leading-[18px]">聯絡電話</span>} name="phone" rules={[{ required: true, }]} >
        <Input size="large" className=" h-[48px]" type="tel" addonBefore={prefixSelector} />
      </Form.Item>

      <Form.Item label={<span className="text-[18px] font-semibold leading-[18px]">收件地址</span>} name="address" rules={[{ required: true }]}>
        <Input size="large" />
      </Form.Item>

      <Form.Item label={<span className="text-[18px] font-semibold leading-[18px]">電子信箱</span>} name="email" rules={[{ required: true }]}>
        <Input size="large" className="" type="email" />
      </Form.Item>

      <Form.Item label={<span className="text-[18px] font-semibold leading-[18px]">身份證號</span>} name="userid" rules={[{ required: false }]} help={<span className=" text-[rgba(255,0,6,1)]">重要提示：因寄件要求，台灣地址請填寫身份證號碼。非台灣地址可不填寫。</span>}>
        <Input size="large" />
      </Form.Item>
    </Form>
    <br/>
    <br/>
    <br/>
    {
      readySubmit ?
        <div className=" ml-[160px] h-[48px] w-[160px] rounded-[12px]  bg-[rgba(255,214,0,1)] border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover-btn-shadow flex justify-center items-center text-[18px] xl:text-[18px] leading-[18px] xl:leading-[18px] font-semibold select-none" >
          簽名並提交
        </div>
        :
        <div className=" ml-[160px] h-[48px] w-[160px] rounded-[12px]  bg-white border-[2px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex justify-center items-center text-[18px] xl:text-[18px] leading-[18px] xl:leading-[18px] font-semibold select-none opacity-30" onClick={handlePreCheck} >
          簽名並提交
        </div>
    }

  </div>
}
