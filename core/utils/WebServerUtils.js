class WebServerUtils {
    constructor(stageVariables) {
        this.WSDL_URI = stageVariables.WSDL_URI;
        this.SOAPAction = stageVariables.SOAPAction;
        this.ExternalTerminal = stageVariables.EXTERNAL_TERMINAL;
        this.PONTO_ATENDIMENTO_LOGIN = stageVariables.PONTO_ATENDIMENTO_LOGIN;
        this.PONTO_ATENDIMENTO_PASSWORD = stageVariables.PONTO_ATENDIMENTO_PASSWORD;
        this.IP_ADDRESS = stageVariables.IP_ADDRESS;
    }

    getWSDL_URI() {
        return this.WSDL_URI;
    }

    getOptions() {
        return {
            wsdl_headers: {
                'SOAPAction': this.SOAPAction,
                'Content-Type': 'text/xml'
            },
            envelopeKey: 's'
        };    
    }

    getExternalTerminal() {
        return this.ExternalTerminal;
    }

    getMethodToProcessTransaction(client) {
        return client['GatewayWeb']['BasicHttpBinding_IGatewayWeb']['ProcessaTransacao'];
    }

    getTransactionArgs(typeXSI, typeTransaction) {
        return {
            $attributes: {
                $xsiType: {
                    type: typeXSI,
                    xmlns: 'http://schemas.datacontract.org/2004/07/TodaConta.WebService.Transacoes'
                },
            },
            CpfCnpj: '11036382702',
            PontoAtendimento: {
                Login: this.PONTO_ATENDIMENTO_LOGIN,
                Senha: this.PONTO_ATENDIMENTO_PASSWORD
            },
            TipoTransacao: typeTransaction
        };
    }

    getIP_ADDRESS() {
        return this.IP_ADDRESS;
    }

    getAttrsByCardPayment(charging) {
        if (charging && charging.TipoPagamento.toUpperCase() === 'CARTAO') {
            return { 
                QtdParcelas: charging.QtdParcelas,
                pontos: 0,
                nomeTitular: charging.nomeTitular,
                numeroCartao: charging.numeroCartao,
                dataVencimento: charging.dataVencimento
            };
        }
        return {};
    }
}

module.exports = WebServerUtils;