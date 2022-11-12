import React,{useState} from "react";
import { TextInput,StyleSheet} from "react-native";

//Ideia de componente encapsulado que corrige e filtra entradas do usuário retornando o valor "data"

const filtrarCaracteres = (texto)=>{
    return  Array.from(texto)
            .filter(c =>"0123456789".includes(c))//caracteres permitidos
            .join("");    
}

const textoParaNumero = (textoDigitado)=>{ //retorna uma data em número compreensível à máquina
    let textoFiltrado = filtrarCaracteres(textoDigitado);

    if(textoFiltrado.length>=8)
    {

        let dia = textoFiltrado.substring(0,2);
        let mes = textoFiltrado.substring(2,4);
        let ano = textoFiltrado.substring(4,8);

        // D D M M A A A A
        //0 1 2 3 4 5 6 7 8

        return parseInt(ano + mes + dia);
    }
    else
    {
        return parseInt(textoFiltrado);
    }
}

export const numeroParaData = (numero)=>{ //retorna uma data compreensível ao usuário e formatado
    
    texto = numero.toString();

    let ano = texto.substring(0,4);
    let mes = texto.substring(4,6);
    let dia = texto.substring(6,8);

    // A A A A M M D D
    //0 1 2 3 4 5 6 7 8

    return dia+"/"+mes+"/"+ano
}

const textoParaData = (textoDigitado)=>{//retorna a data digitada pelo user formatada

    let textoFiltrado = filtrarCaracteres(textoDigitado);

    if(textoFiltrado.length>=8)
    {

    let dia = textoFiltrado.substring(0,2);
    let mes = textoFiltrado.substring(2,4);
    let ano = textoFiltrado.substring(4,8);

    // D D M M A A A A
    //0 1 2 3 4 5 6 7 8

    return dia + "/" + mes + "/" + ano;
    }
    else
    {
        return textoFiltrado;
    }
}

export const DataDeHojeEmNumero = ()=>{//retorna a data de hoje compreensível ao usuário e formatada
    let dataDeHoje = new Date();

    let ano = dataDeHoje.getFullYear().toString(); 
    let mes = (dataDeHoje.getMonth()+1).toString();
    let dia = dataDeHoje.getDate().toString();
    
    if(dia.length==1)dia = "0"+dia;
    if(mes.length==1)mes = "0"+ mes;
    
    return parseInt(ano+mes+dia);
}

export const validarData = (data)=>{
    if(data.toString().length!=8)return false;

    let dataEmTexto = data.toString();

    let ano = parseInt(dataEmTexto.substring(0,4));
    let mes = parseInt(dataEmTexto.substring(4,6));
    let dia = parseInt(dataEmTexto.substring(6,8));

    //formato  A A A A M M D D
    //        0 1 2 3 4 5 6 7 8 

    let anoOk = ano!=0;
    let mesOk = 0 < mes && mes < 13;
    let diaOk = 0 < dia && dia < 32;

    return anoOk && mesOk && diaOk;
}

export default CampoData = ({aoMudarTexto,
                             valorInicial,
                             referencia=()=>{}})=> {
    const [valor, setValor] = useState(numeroParaData(valorInicial));

    return(
    <TextInput  style={estilo.Campos} 
                placeholderTextColor="gray"
                placeholder="Informe a data(opcional)..."
                value={valor}
                keyboardType="number-pad"
                onChangeText={t =>{
                    setValor(textoParaData(t)); // o que usuário vai ver
                    aoMudarTexto(textoParaNumero(t)); // o que o aplicativo vai ver
                }}
                ref={r=>{referencia(r)}}
                />
    );
}

const estilo = StyleSheet.create({
    Campos:{
        fontSize: 12,
        color:"black",
        textAlign:"center",
        borderColor:"black",
        borderStyle:"solid",
        borderWidth:2,
        margin:10,
        padding: 2
    }
})

