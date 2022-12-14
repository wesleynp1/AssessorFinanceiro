import { View,Text} from "react-native";
import FormularioTransacao from "../FormularioTransacao";

const PaginaNovaTransacao = ({novaTransacao, nomeContas, eDespesa})=>{
    
    let transacaoInicial = {categoria:"",
                            conta: nomeContas[0],
                            data: new Date(),
                            valor:0}
    

    return(
        <View>
            <Text style={{color:(eDespesa ? "red" : "green"),fontSize:16, margin: 10, textAlign:"center"}}>
                INSIRA AS INFORMAÇÕES DA NOVA {(eDespesa ? "DESPESA" : "RECEITA")}
            </Text>

            <FormularioTransacao    
            transacaoInicial={transacaoInicial} 
            contas={nomeContas}
            eDespesa={eDespesa}
            aoSubmeter={tr=>{novaTransacao(tr)}}/>
        </View>
    );
}

export default PaginaNovaTransacao