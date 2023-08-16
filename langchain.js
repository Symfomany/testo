
// export OPENAI_API_KEY="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"



const { OpenAI } = require("langchain/llms/openai");


const llm = new OpenAI();

const main = async () =>{

    const result = await llm.predict(`Résumes-moi ce article:

    Avant que le consommateur ne soit lié par un contrat à titre onéreux, le professionnel communique au consommateur, de manière lisible et compréhensible, les informations suivantes :
    1° Les caractéristiques essentielles du bien ou du service, ainsi que celles du service numérique ou du contenu numérique, compte tenu de leur nature et du support de communication utilisé, et notamment les fonctionnalités, la compatibilité et l'interopérabilité du bien comportant des éléments numériques, du contenu numérique ou du service numérique, ainsi que l'existence de toute restriction d'installation de logiciel ;
    2° Le prix ou tout autre avantage procuré au lieu ou en complément du paiement d'un prix en application des articles L. 112-1 à L. 112-4-1 ;
    3° En l'absence d'exécution immédiate du contrat, la date ou le délai auquel le professionnel s'engage à délivrer le bien ou à exécuter le service ;
    4° Les informations relatives à l'identité du professionnel, à ses coordonnées postales, téléphoniques et électroniques et à ses activités, pour autant qu'elles ne ressortent pas du contexte ;
    `);
    
    console.log(result)
    
} 
main()