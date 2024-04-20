import inquirer from 'inquirer';
import * as readline from 'readline';

// Define options array before using it
const options = [
    {
        type: 'list',
        name: 'option',
        choices: [
            {                
                value: 1,
                name: '1. Search city'
            },
            {                
                value: 2,
                name: '2. History'
            },
            {                
                value: 3,
                name: '3. Exit'
            }
        ]
    },
];

const inquirerMenu = async() => {
    console.clear();
    console.log('=============================');
    console.log('   Please select an option:  ');
    console.log('=============================');
    
    
    const { option } = await inquirer.prompt(options); 

    return option;
}

const pause = () => {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Press ENTER to continue...', () => {
            resolve();
            rl.close();
        });
    });
}

const readInput = async(msg) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message: msg,
            validate(value){
                if(value.length === 0){
                    return "Please write something..."
                }
                return true
            }

        }
    ]

    const {desc} = await inquirer.prompt(question)
    return desc
}

const cityList = async(cities=[]) => {
    const choices = cities.map((city, i) =>{
         let idx = i+1 
        return {
            value: city.id,
            name: `${idx}. ${city.name}`
        }
    })

    choices.unshift({
        value: '0',
        name: '0. Cancelar'
    })
    let questions = [
        {
            type: 'list',
            name: 'id',
            message: 'Choose a place...',
            choices: choices
        }
    ]

    const { id } = await inquirer.prompt(questions);
    return id
}

const confirm = async(message) => {

    let questions = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]
    const {ok} = await inquirer.prompt(questions)
    return ok;

}

const completePentingList = async(tasks) => {
    const choices = tasks.map((task, i) =>{
        let idx = i+1 
       return {
           value: task.id,
           name: `${idx}. ${task.desc}`,
           checked: true
       }
   })
   let question = [
       {
           type: 'checkbox',
           name: 'ids',
           message: 'seleccionar',
           choices
       }
   ]
   const { ids } = await inquirer.prompt(question);
   return ids
} 





export {
    inquirerMenu,
    options,
    pause,
    readInput,
    cityList,
    confirm,
    completePentingList
}
