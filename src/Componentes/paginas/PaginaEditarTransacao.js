import { View,Text, Button } from "react-native";
import FormularioTransacao from "../FormularioTransacao";
import {Picker} from '@react-native-picker/picker';
import { useState } from "react";

const PaginaEditarTransacao = ({atualizarTransacao,transacaoInicial, contas})=>{
    const [eDespesa,seteDespesa] = useState(transacaoInicial.valor<0 ? true : false);

    return(
        <View>
            <Text style={{color:(eDespesa ? "red" : "green"),fontSize:16, margin: 10, textAlign:"center"}}>
                INSIRA AS INFORMAÇÕES DA NOVA {(eDespesa ? "DESPESA" : "RECEITA")}
            </Text>

            <Picker 
                selectedValue={eDespesa}
                onValueChange={v=>{seteDespesa(v)}}
                dropdownIconColor="black"
                style={{color:"black",textAlign:"center"}}
                >
                
                <Picker.Item label="DESPESA" value={true}/>
                <Picker.Item label="RECEITA" value={false}/>
            </Picker>

            <FormularioTransacao    transacaoInicial={transacaoInicial} 
                                    contas={contas}
                                    eDespesa={eDespesa}
                                    aoSubmeter={tr=>{atualizarTransacao(tr)}}/>
        </View>
    );
}

export default PaginaEditarTransacao