import { customAlert } from "./CommonMethods";
/**
 *
 * @param {*} obj escopo da classe de onde é chamado.
 * @param {*} endpoint API endpoint.
 * @param {*} data Corpo se os dados devem ser enviados.
 * @param {*} returnMethod retorno de chamada para o componente principal.
 * @param {*} type Metodo i.e. POST,GET,DELETE etc.
 * @param {*} loader Se o loadding deve ser mostrado ou não (booleano)
 */

export async function callRemoteMethod(obj, endpoint, data, returnMethod, type = "GET", loader, params) {
  if (loader == true) {
    obj.setState({ isLoading: true });
  }
  var request = {
    method: type,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };

  if (type != "GET") {
    request.body = JSON.stringify(data);
  }

  await fetch(endpoint, request)
    .then(response => response.json())
    .then(responseJson => {
      if (loader == true) {
        obj.setState({ isLoading: false });
      }
      responseJson.params = params
      eval("obj." + returnMethod + `(responseJson)`);
    }) 
    .catch(error => {
      obj.setState({ isLoading: false });
      setTimeout(() => {
        customAlert(error.message);
      }, 500);
    });
}