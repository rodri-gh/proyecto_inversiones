  <template>
  <div class="container col-md-4 mt-5">
    <div class="card shadow border-0">
      <div class="card-body">
        <h4 class="card-title text-center">Categoria Posts</h4>
        <div class="text-end">
          <Button
            data-bs-toggle="modal"
            data-bs-target="#modalCategoryPost"
            text="Nuevo"
            icon="fa fa-plus"
          />
        </div>
        <TableCategoryPost
          :headers="headers"
          :items="categoryPosts"
          :actions="{
            edit: selectCategoryPost,
            delete: deleteCategoryPost,
          }"
        />
      </div>
    </div>

    <Modal
      modalId="modalCategoryPost"
      title="Datos de la Categoria-Post"
      :showSaveButton="!selectedCategoryPost?.category_post_id"
      :showUpdateButton="Boolean(selectedCategoryPost?.category_post_id)"
      @onClose="reset()"
      @onSave="saveCategory()"
    >
      <Input
        id="name"
        label="Nombre"
        v-model="name"
        type="text"
        placeholder="Ingrese el nombre"
      />
    </Modal>
  </div>
</template>

  <script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Button from "@/components/base/Button.vue";
import TableCategoryPost from "@/components/tables/TableCategoryPost.vue";
import Modal from "@/components/base/Modal.vue";
import Input from "@/components/base/Input.vue";
import { closeModal, openModal } from "@/utils/modal";

const headers = ["Nombre", "Acciones"];

const baseURL = "http://localhost:3000/categoryPosts/";
const categoryPosts = ref([]);
const name = ref("");
const selectedCategoryPost = ref({});

onMounted(() => {
  getCategoryPosts();
});

const getCategoryPosts = async () => {
  try {
    const { data } = await axios.get(baseURL);
    categoryPosts.value = data.data;
    console.log(categoryPosts.value);
  } catch (error) {
    console.log(error);
  }
};

const saveCategory = async () => {
  const method = selectedCategoryPost.value.category_post_id ? "put" : "post";
  const url = selectedCategoryPost.value.category_post_id
    ? `${baseURL}${selectedCategoryPost.value.category_post_id}`
    : baseURL;

  const categoryPost = createCategory();

  try {
    await axios[method](url, categoryPost);

    closeModal("modalCategoryPost");
    getCategoryPosts();
    reset();
  } catch (error) {
    console.log(error);
  }
};

const createCategory = () => {
  const categoryPost = {
    name: name.value,
  };
  return categoryPost;
};

const selectCategoryPost = (categoryPost) => {
  selectedCategoryPost.value = categoryPost;

  name.value = categoryPost.name;

  openModal("modalCategoryPost");
};

const deleteCategoryPost = async (id) => {
  try {
    const { data } = await axios.patch(baseURL + id);
    console.log(data);
    getCategoryPosts();
  } catch (error) {
    console.log(error);
  }
};

const reset = () => {
  name.value = "";
  selectedCategoryPost.value = {};
};
</script>

  <style  scoped>
</style>