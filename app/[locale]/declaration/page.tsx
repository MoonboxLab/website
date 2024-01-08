"use client"
import Header from "@/components/Header";
import { useSize } from "ahooks";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";

export default function Declaration() {
  const t = useTranslations('Declaration');
  const mediaSize = useSize(document.querySelector("body"));
  
  useEffect(() => {
    // 获取导航菜单项
    const navItems = document.querySelectorAll('.anchorItem');

    // 监听导航菜单项的点击事件
    navItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault(); // 阻止默认的跳转行为

        const targetId = item.getAttribute('href');
        // @ts-ignore
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const offset = (mediaSize?.width || 0) > 1500 ? 250 : 180; // 自定义的偏移量

          // 计算目标元素的距离页面顶部的偏移量，并滚动到相应位置
          const targetOffsetTop = targetElement.offsetTop - offset;
          window.scrollTo({
            top: targetOffsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    // 监听滚动事件
    window.addEventListener('scroll', () => {
      const offset = (mediaSize?.width || 0) > 1500 ? 250 : 180; // 自定义的偏移量
 
      var isChange = false;
      // 遍历目标部分，检查当前滚动位置与目标部分的位置关系
      document.querySelectorAll('h1').forEach((section) => {
        const rect = section.getBoundingClientRect();

        // 如果目标部分在可视区域内，则更新对应导航项的样式
        if (rect.top <= window.innerHeight && rect.bottom > offset) {
          const targetId = section.getAttribute('id');

          if (isChange) {
            return
          } else {
            isChange = true;
          }

          // 移除所有导航项的高亮样式
          navItems.forEach((item) => {
            item.classList.remove('activeAnchor');
          });

          // 给对应导航项添加高亮样式
          const targetNavItem = document.querySelector(`.anchorItem[href="#${targetId}"]`);
          if (targetNavItem) {
            targetNavItem.classList.add('activeAnchor');
          }
        }
      });
    });
  }, [])

  return <div className=" relative bg-black">
    <div className=" fixed z-20 top-0 w-full left-0 right-0 bg-white/10 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <Header />
    </div>

    <div className=" fixed right-[24px] bottom-[2px] w-[300px] opacity-30 sm:w-0 2xl:opacity-100 2xl:right-[142px] xl:bottom-[30px] 3xl:bottom-[80px]  2xl:w-[300px] 3xl:w-[400px] 4xl:w-[450px] h-[500px]">
      <Image src={"/declaration_ill.webp"} alt="ill" fill style={{ objectFit: 'contain' }} />
    </div>

    <div className=" hidden sm:block fixed top-[-50px] left-[-50px] w-[1077px] h-[695px] ">
      <Image src={"/bg_light.png"} alt="light" fill style={{ objectFit: 'contain' }} />
    </div>

    <div className=" hidden lg:flex fixed left-[40px] 2xl:left-[80px] 3xl:left-[100px] 4xl:left-[120px] top-[17%] h-[66%] text-[24px] font-semibold leading-[24px] w-[200px] border-red-500 items-center">
      <div className=" text-white flex-col mr-[20px]">
        <div className="anchor text-right h-[100px] leading-[100px] w-[180px]"><a href="#nav1" className="anchorItem activeAnchor ">{t("spirit")}</a></div>
        <div className="anchor text-right h-[100px] leading-[100px] w-[180px]"><a href="#nav2" className="anchorItem ">{t("mission")}</a></div>
        <div className="anchor text-right h-[100px] leading-[100px] w-[180px]"><a href="#nav3" className="anchorItem ">{t("nft")}</a></div>
        <div className="anchor text-right h-[100px] leading-[100px] w-[180px]"><a href="#nav4" className="anchorItem ">{t("community")}</a></div>
      </div>
      <div className=" border-l border-dashed border-white h-full"></div>
    </div>

    <div className=" relative z-10 max-w-[720px] mx-auto lg:ml-[298px] 2xl:ml-[398px] px-4 sm:px-3 pt-[140px] lg:pt-[180px] 3xl:pt-[250px] pb-12 sm:pb-[100px] lg:pb-[200px] h-auto ">
      <h1 id="nav1" className="title mb-[40px] lg:mb-[60px] text-[44px] lg:text-[60px] 3xl:text-[72px] font-semibold leading-[36px] lg:leading-[60px] text-white">{t("title1")}</h1>
      <p className=" text-[18px] lg:text-[22px] 3xl:text-[24px] font-medium leading-[30px] lg:leading-[44px] 3xl:leading-[48px] text-white">{t.rich('subtitle1', { br: () => <br /> })}
      </p>
      <h1 id="nav2" className="title mt-[60px] lg:mt-[120px] mb-[40px] lg:mb-[60px] text-[44px] lg:text-[60px] 3xl:text-[72px] font-semibold leading-[36px] lg:leading-[60px] text-white">{t("title2")}</h1>
      <p className=" text-[18px] lg:text-[22px] 3xl:text-[24px] font-medium leading-[30px] lg:leading-[44px] 3xl:leading-[48px] text-white">{t.rich('subtitle2', { br: () => <br /> })}</p>
      <h1 id="nav3" className="title mt-[60px] lg:mt-[120px] mb-[40px] lg:mb-[60px] text-[44px] lg:text-[60px] 3xl:text-[72px] font-semibold leading-[36px] lg:leading-[60px] text-white">{t("title3")}</h1>
      <p className=" text-[18px] lg:text-[22px] 3xl:text-[24px] font-medium leading-[30px] lg:leading-[44px] 3xl:leading-[48px] text-white">
        {t.rich('subtitle3', { br: () => <br /> })}
      </p>
      <h1 id="nav4" className="title mt-[60px] lg:mt-[120px] mb-[40px] lg:mb-[60px] text-[44px] lg:text-[60px] 3xl:text-[72px] font-semibold leading-[36px] lg:leading-[60px] text-white">{t("title4")}</h1>
      <p className=" text-[18px] lg:text-[22px] 3xl:text-[24px] font-medium leading-[30px] lg:leading-[44px] 3xl:leading-[48px] text-white">
        {t.rich('subtitle4', { br: () => <br /> })}
      </p>
    </div>
  </div>
}