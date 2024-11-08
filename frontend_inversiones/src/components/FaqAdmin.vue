  <template>
  <div class="container col-md-10 mt-5">
    <h4 class="card-title text-center">Preguntas Frecuentes</h4>
    <div class="text-end">
      <Button
        data-bs-toggle="modal"
        data-bs-target="#modalFaq"
        text="Nuevo"
        icon="fa fa-plus"
      />
    </div>
    <TableFaq
      :headers="headers"
      :items="faqs"
      :actions="{
        edit: selectFaq,
        delete: deleteFaq,
      }"
    />

    <Modal
      modalId="modalFaq"
      title="Pregunta Frecuente"
      :showSaveButton="!selectedFaq?.id"
      :showUpdateButton="Boolean(selectedFaq?.id)"
      @onClose="reset()"
      @onSave="saveFaq()"
    >
      <Input id="ask" label="Pregunta" v-model="ask" type="text" />

      <InputTextArea id="answer" label="Respuesta" v-model="answer" />
    </Modal>
  </div>
</template>

  <script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableFaq from "@/components/tables/TableFaq.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import InputTextArea from "@/components/base/InputTextArea.vue";
import { closeModal, openModal } from "@/utils/modal";

const headers = ["Pregunta", "Respuesta", "Estado", "Acciones"];

const baseURL = "http://localhost:3000/faq/";
const faqs = ref([]);
const ask = ref("");
const answer = ref("");
const selectedFaq = ref({});

onMounted(() => {
  getfaqs();
});

const getfaqs = async () => {
  try {
    const { data } = await axios.get(baseURL);
    faqs.value = data;
    console.log(faqs.value);
  } catch (error) {
    console.log(error);
  }
};

const saveFaq = async () => {
  const method = selectedFaq.value.id ? "put" : "post";
  const url = selectedFaq.value.id
    ? `${baseURL}${selectedFaq.value.id}`
    : baseURL;

  const faq = createFaq();

  try {
    await axios[method](url, faq);

    closeModal("modalFaq");
    getfaqs();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createFaq = () => {
  const faq = {
    ask: ask.value,
    answer: answer.value,
  };
  return faq;
};

const selectFaq = (faq) => {
  selectedFaq.value = faq;

  ask.value = faq.ask;
  answer.value = faq.answer;

  openModal("modalFaq");
};

const deleteFaq = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id);
    console.log(data);
    getfaqs();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  ask.value = "";
  answer.value = "";
  selectedFaq.value = {};
};
</script>

  <style  scoped>
</style>