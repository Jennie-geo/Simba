import axios from 'axios';
import { GetRateReturn, GetRateReturnType } from '../interface/apiInterface';
import exchangeRates from 'exchange-rates-api';

export async function getRateControllers(
  base_code: string,
  target_code: string,
): Promise<any> {
  const api = await axios
    .get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${base_code}/${target_code}`,
    )
    .then((data) => {
      const { base_code, target_code, conversion_rate } = data.data;
      return { base_code, target_code, conversion_rate };
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  return api;
}

export async function getRate(
  source_currency: string,
  dest_currency: string,
): Promise<GetRateReturnType> {
  const [day, month, year] = new Date().toLocaleDateString().split('/');

  const apiResponse = await axios
    .request<GetRateReturnType>({
      url: `https://swop.cx/rest/rates/${source_currency}/${dest_currency}?api-key=${
        process.env.RATE_API_KEY
      }&date=${year}-${month}-${'02' || String(+day - 1).padStart(2, '0')}`,
    })
    .then((data) => {
      const { base_currency, quote_currency, date, quote } = data.data;
      return { base_currency, quote_currency, date, quote };
    })
    .catch((error) => ({
      error,
      base_currency: '',
      quote_currency: '',
      date: '',
      quote: 0,
    }));

  return apiResponse;
}

// export async function getRateController(req: Request,res: Response,): Promise<any> {
//   // 'https://v6.exchangerate-api.com/v6/e040af17b11ab1c76fa9fdf9/latest/USD',
//   try {
//     const {base_code, target_code} = req.body;
//     const { data } = await axios.get(
//       `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${base_code}/${target_code}`
//     );
//     console.log(data);
//     res.send({ Data: data });
//   } catch (err) {
//     res.send({ Errors: err });
//   }
// }
