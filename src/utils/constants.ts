export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
  
};

export const buttonNames = <Record<string, string>>{
    "notSale": "Недоступно",
    "inBasket": "Удалить из корзины",
    "notInBasket": "Купить",
  } 

export const categoryColors = <Record<string, string>>{
    "софт-скил": "soft",
    "хард-скил": "hard",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button",
  }

  export const formErrorsMassage = <Record<string, string>> {
    "order": "Выберите способ оплаты и заполните адрес доставки",
    "contacts": "Заполните номер телефона и адрес электронной почты",
  }