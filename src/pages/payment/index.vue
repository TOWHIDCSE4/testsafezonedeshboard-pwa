<template>
  <div class="tw-container tw-mx-auto">
    <div class="tw-relative tw-flex tw-justify-center">
      <div class="tw-absolute tw-top-1/2 tw-translate-y-1/2">
        <div class="auth-logo">
          <img src="@/assets/images/safe-zone-logo.png" class="logo" />
        </div>
        <div class="tw-text-center tw-mt-2" v-if="isPayment">
          <div
            class="tw-text-text-grey tw-font-semibold tw-text-lg tw-text-center"
          >
            Xử lý đơn hàng
          </div>
          <div class="tw-text-text-grey tw-mt-3 tw-text-center">
            Giao dịch đang được xử lý...
            <div class="tw-mt-1">
              Không nhấn bất kỳ nút nào đến khi giao dịch hoàn tất.
            </div>
          </div>
          <ProcessLoading class="tw-mt-6" />
        </div>
        <div v-if="!isPayment" class="tw-text-center">
          <q-icon
            v-if="paymentSuccess"
            name="verified_user"
            size="50px"
            class="tw-text-success tw-mt-2"
          />
          <q-icon
            v-if="!paymentSuccess"
            name="gpp_bad"
            size="50px"
            class="tw-text-error-dark tw-mt-2"
          />
          <div
            class="tw-mt-3"
            :class="{
              'tw-text-success': paymentSuccess,
              'tw-text-error-dark': !paymentSuccess,
            }"
          >
            {{
              paymentSuccess
                ? 'Bạn đã đăng ký thành công'
                : 'Đăng ký không thành công'
            }}
          </div>
          <div
            v-if="paymentSuccess"
            class="tw-text-text-grey tw-font-bold tw-text-lg tw-mt-2 tw-uppercase"
          >
            {{ orderData.orderName }}
          </div>
          <div v-if="paymentSuccess" class="tw-text-text-grey tw-italic">
            Thời gian sử dụng: {{ currentDay }} đến {{ expiredDate }}
          </div>
          <div v-if="paymentSuccess" class="tw-text-text-grey tw-mt-3">
            Đăng ký thành công gói SafeZone Premium với đầy đủ tất cả chức
            năng.<br />Bạn có thể thiết lập các quy tắc ngay bây giờ.
          </div>
          <div
            v-if="!paymentSuccess && paymentMessage"
            class="tw-text-text-grey tw-mt-3"
          >
            Yêu cầu thanh toán đã bị hủy bỏ.
          </div>
          <div
            v-if="!paymentSuccess && orderStatus === 2"
            class="tw-text-text-grey tw-mt-3"
          >
            Có lỗi từ hệ thống. Vui lòng thử lại sau.<br />Mã đơn hàng:
            {{ orderId }}
          </div>
          <div
            v-if="!paymentSuccess && orderStatus === 3"
            class="tw-text-text-grey tw-mt-3"
          >
            Đơn hàng đang được xử lý. Vui lòng liên hệ để biết thêm chi tiết.<br />Mã
            đơn hàng:
            {{ orderId }}
          </div>
          <q-btn
            color="primary"
            class="tw-font-semibold tw-mt-5"
            label="Trở về trang chủ"
            @click="goToHomePage"
            no-caps
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import ProcessLoading from '@components/base/ProcessLoading.vue';
import { date } from 'quasar';
import subscriptionApi from '@api/subscription';

const timeStamp = Date.now();
const currentDay = date.formatDate(timeStamp, 'DD/MM/YYYY');
const router = useRouter();
const route: any = useRoute();

const isPayment = ref(true);
const paymentMessage = ref<string>('');
const orderStatus = ref<number>(0);
const orderData = ref<any>({});

const expiredDate = computed(() => {
  if (orderData.value.externalMetadata.extraData) {
    const {
      plan: { totalUseDays },
    } = JSON.parse(JSON.parse(orderData.value.externalMetadata.extraData));
    const expired = date.addToDate(timeStamp, { days: totalUseDays });
    return date.formatDate(expired, 'DD/MM/YYYY');
  }
});

const orderId = computed(() => {
  if (!route.query) return;
  if (route.query) {
    const { orderId } = route.query;
    return orderId;
  }
});

const signature = computed(() => {
  if (!route.query) return;
  if (route.query) {
    const { signature } = route.query;
    return signature;
  }
});

const paymentSuccess = computed(() => {
  return orderStatus.value === 1;
});

watch(isPayment, () => {
  clearInterval(checkOrder);
});

const getOrderProcess = async () => {
  const { getOrderById } = subscriptionApi();
  try {
    if (!route.query) return;
    if (route.query) {
      const { orderId, message, signature } = route.query;
      const data: any = await getOrderById(orderId, signature);

      if (!data) return;
      if (data) {
        const result = data.result;
        if (result.orderStatus) {
          orderStatus.value = result.orderStatus;
          orderData.value = result;
          isPayment.value = false;
        } else {
          if (message === 'Customer cancelled the transaction') {
            paymentMessage.value = message;
            isPayment.value = false;
          }
        }
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const checkOrder = setInterval(getOrderProcess, 3000);

const goToHomePage = () => {
  router.push('/');
};
</script>
<style lang="scss" scoped>
.auth-logo {
  display: flex;
  justify-content: center;
}
.logo {
  width: 200px;
}
</style>
