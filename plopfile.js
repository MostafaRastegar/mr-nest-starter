const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

module.exports = function (plop) {
  plop.setHelper('entityCapitalized', (entity) => {
    if (!entity) {
      console.error('Please provide a name for the entity');
      return '';
    }
    return entity.charAt(0).toUpperCase() + entity.slice(1);
  });

  plop.setPartial('entityCapitalized', '{{entityCapitalized entity}}'); // Use the helper as a partial
  plop.setActionType('custom', async function (answers) {
    const entity = answers.entity;
    const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
    const entityFilePath = path.resolve(
      __dirname,
      `src/${entity}/${entity}.entity.ts`,
    );
    // Read the entity file
    const entityFileContent = fs.readFileSync(entityFilePath, 'utf-8');

    // Generate DTO content from entity properties
    const dtoContent = generateDtoContent(entityFileContent, entityName);
    // Define the directory path
    const dirPath = path.resolve(__dirname, `src/${entity}/dto`);

    // Check if the directory exists
    if (!fs.existsSync(dirPath)) {
      // If it doesn't exist, create the directory
      fs.mkdirSync(dirPath, { recursive: true }); // 'recursive: true' allows creation of nested directories
    }

    Object.keys(dtoContent).forEach((actionName) => {
      // Write DTO file
      fs.writeFileSync(
        path.resolve(
          __dirname,
          `src/${entity}/dto/${actionName}-${entity}.dto.ts`,
        ),
        dtoContent[actionName],
      );
    });

    console.log(`${entityName} DTO file generated successfully.`);
  });

  plop.setGenerator('generate entities', {
    description: 'Generate NestJS components from JSON',
    prompts: [
      {
        type: 'list',
        name: 'entity',
        message: 'Select an entity to generate',
        choices: () => {
          // get all the directories within the current folder
          return fs
            .readdirSync('./src', { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
        },
      },
      // {
      //   type: 'input',
      //   name: 'entity',
      //   message: 'Select an entity to generate',
      //   // choices: Object.keys(jsonData),
      // },
    ],
    actions: function (answers) {
      console.log('answers :>> ', answers);
      const entity = answers.entity;
      return [
        {
          type: 'custom',
        },
        {
          type: 'add',
          path: `src/{{entity}}/{{entity}}.module.ts`,
          templateFile: './plop-template/module.template.ts.hbs',
        },
        {
          type: 'add',
          path: `src/{{entity}}/{{entity}}.service.ts`,
          templateFile: './plop-template/service.template.ts.hbs',
        },
        {
          type: 'add',
          path: `src/{{entity}}/{{entity}}.controller.ts`,
          templateFile: './plop-template/controller.template.ts.hbs',
        },
      ];
    },
  });
};

const generateDtoContent = (entityFileContent, entityName) => {
  const propertyRegex = /(\w+)\s*:\s*(.*?);/g;
  let match;
  let dtoProperties = '';

  while ((match = propertyRegex.exec(entityFileContent)) !== null) {
    const propertyName = match[1];
    const propertyType = match[2];

    // Generate Create DTO properties
    if (propertyName !== 'id') {
      dtoProperties += `${propertyName}: ${propertyType};\n`;
    }
  }

  return {
    create: `export class Create${entityName}Dto {
  ${dtoProperties}
}`,
    update: `export class Update${entityName}Dto {
  ${dtoProperties}
}
`,
  };
};

// const typeToValidatorMap = {
//   string: 'IsString',
//   number: 'IsInt',
//   boolean: 'IsBoolean',
//   // Additional mappings for various types and validation decorators
//   date: 'IsDate',
//   array: 'IsArray',
//   object: 'IsObject',
//   email: 'IsEmail',
//   url: 'IsUrl',
//   uuid: 'IsUUID',
//   enum: 'IsEnum',
//   // For numeric types
//   positive: 'IsPositive',
//   negative: 'IsNegative',
//   min: 'Min',
//   max: 'Max',
//   // For string types
//   minLength: 'MinLength',
//   maxLength: 'MaxLength',
//   // For custom validations
//   matches: 'Matches',
//   // For validation of numeric ranges
//   minDate: 'MinDate',
//   maxDate: 'MaxDate',
//   // For validation of specific conditions
//   isIn: 'IsIn',
//   isNotIn: 'IsNotIn',
// };
