/**
 * @description Exibir alerta com texto sempre que chamado.
 * @param customString Mensagem que você deseja exibir.
 */
export function customAlert(customString) {
    setTimeout(() => {
      alert(customString);
    }, 5);
  }
  
  /**
   * @param condition A condição que deve ser verificada.
   * @param content O conteúdo a ser mostrado quando a condição for verdadeira.
   */
  
  export function renderIf(condition, content) {
    if (condition) {
      return content;
    } else {
      return null;
    }
  }