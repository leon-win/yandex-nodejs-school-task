<template>
  <div>
    <h2>Hello Yandex NodeJS school!</h2>

    <div>
      <form id="myForm" :action="getAction()" @submit.prevent="submit">
        <input v-for="field in fields"
               v-model="field.value"
               class="field"
               :class="fieldClass(field)"
               :name="field.phone"
               :placeholder="field.placeholder"
               @change="clearValidation()"
        />

        <button id="submitButton" :disabled="isProcess">Submit</button>
      </form>

      <div id="resultContainer" class="container" :class="resultContainerClass">{{ resultContainerText }}</div>
    </div>
  </div>
</template>

<style>
  .field {
    display: block;
    margin-bottom: 5px;
    padding: 5px;
    border: 1px solid #ccc;
  }

  .container {
    margin-top: 5px;
    padding: 5px;
  }

  .error {
    border: 1px solid red;
  }

  .success {
    border: 1px solid green;
  }

  .progress {
    border: 1px solid orange;
  }
</style>

<script>
  export default {
    data() {
      return {
        actions: [
          'data/success.json',
          'data/error.json',
          'data/progress.json'
        ],
        fields: [
          {
            name: 'fio',
            placeholder: 'Pushkin Alexander Sergeyevich',
            value: undefined,
            isValid() {
              if (!this.value) {
                return false;
              }

              let words = this.value.split(' ');
              
              return words.length === 3;
            }
          },
          {
            name: 'email',
            placeholder: 'alex.pushkin@yandex.ru',
            value: undefined,
            isValid() {
              return /^[a-zA-Z0-9]+[a-zA-Z0-9_.+-]*@(ya.ru|yandex.ru|yandex.ua|yandex.by|yandex.kz|yandex.com)$/.test(this.value);
            }
          },
          {
            name: 'phone',
            placeholder: '+7(999)999-99-99',
            value: undefined,
            isValid() {
              if (!(/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(this.value))) {
                return false;
              }

              let digits = this.value.match(/\d/g);
              let sum = digits.reduce((sum, digit) => {
                return sum + Number(digit);
              }, 0);

              return !(sum > 30);
            }
          }
        ],
        isProcess: false,
        isValidation: false,
        result: {}
      }
    },
    computed: {
      resultContainerClass() {
        if (this.result && this.result.status) {
          return [this.result.status];
        }
      },
      resultContainerText() {
        if (this.result && this.result.status && this.result.status === 'success') {
          return 'Success';
        }

        if (this.result && this.result.status && this.result.status === 'error') {
          return this.result.reason;
        }

        if (this.result && this.result.status && this.result.status === 'progress') {
          return 'Progress...';
        }
      }
    },
    methods: {
      clearValidation() {
        this.isValidation = false;
      },
      fieldClass(field) {
        if (!this.isValidation) {
          return;
        }

        if (!field.isValid()) {
          return ['error'];
        }
      },
      getAction() {
        return this.actions[Math.floor(Math.random() * this.actions.length)];
      },
      getData() {
        return this.fields.reduce((result, field) => {
          result[field.name] = field.value;

          return result;
        }, {});
      },
      setData(fields) {
        this.fields.forEach((field) => {
          field.value = fields[field.name];
        })
      },
      submit() {
        let validationResult = this.validate();

        if (validationResult.isValid) {
          this.isProcess = true;

          fetch(this.getAction())
            .then((response) => {
              return response.json();
            })
            .then((response) => {
              this.result = response;

              if (response.status === 'progress') {
                setTimeout(this.submit, response.timeout, this.getAction());
              } else {
                this.isProcess = false;
              }
            })
            .catch(() => {
              this.isProcess = false;
            });
        }
      },
      validate() {
        this.isValidation = true;

        let errorFields = [];

        this.fields.map((field) => {
          if (!field.isValid()) {
            errorFields.push(field.name);
          }
        });

        return {
          isValid: errorFields.length === 0,
          errorFields: errorFields
        }
      }
    }
  };
</script>
