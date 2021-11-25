<template>
  <div class="coming">
    <img src="./../assets/images/coming.png" alt="" />
    <p>Coming soon...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    name() {},
  },
};
</script>

<style lang="less" scoped>
.coming {
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  img {
    width: 160px;
    margin-bottom: 5px;
  }
  p {
    font-size: 18px;
    font-family: Rubik-Regular, Rubik;
    font-weight: 400;
    color: rgba(41, 40, 40, 0.6);
  }
}
</style>