import Api from "@/services/Api";

export default {
  fetchPosts() {
    return Api().get("cases");
  },
  addPost() {
    return Api().post("cases");
  },
  updatePost(params) {
    return Api().put("cases/" + params.id, params);
  },
  getPost(params) {
    return Api().get("case/" + params.id);
  },
  deletePost (id) {
    return Api().delete('cases/' + id)
  }
};
