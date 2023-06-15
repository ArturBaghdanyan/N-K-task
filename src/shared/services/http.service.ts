import Axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
Axios.defaults.baseURL = API_URL;

class HttpService {
  _axios: AxiosInstance = Axios.create();

  get = async (url: string) =>
    await this.request(this.getOptionsConfig('get', url));

  post = async (url: string, data: any, options?: any) =>
    await this.request(this.getOptionsConfig('post', url, data, options));

  put = async (url: string, data: any) =>
    await this.request(this.getOptionsConfig('put', url, data));

  delete = async (url: string) =>
    await this.request(this.getOptionsConfig('delete', url));

  private getOptionsConfig = (
    method: any,
    url: string,
    data?: any,
    options?: any
  ) => ({ method, url, data, ...options });

  private request(options: any) {
    return new Promise((resolve, reject) => {
      this._axios
        .request(options)
        .then((res) => resolve(res.data))
        .catch((ex) => reject(ex.response?.statusText));
    });
  }
}

export default new HttpService();
