<template>
  <div class="plans-wrapper">
    <div class="sm:tw-pt-6 plans-list">
      <div class="sm:tw-grid sm:tw-grid-cols-3 sm:tw-gap-4">
        <q-card
          v-for="(item, index) in subscriptionData"
          :hidden="item.isFree"
          :key="index"
          class="tw-rounded-lg tw-py-6 tw-px-8 tw-text-center tw-relative card-wrapper"
          :class="{
            'tw-bg-white tw-text-text-grey': item.name !== 'Standard',
            'tw-bg-primary tw-text-white': item.name === 'Standard',
          }"
          flat
        >
          <div class="tw-text-sm tw-font-semibold">{{ item.name }}</div>
          <div
            class="tw-absolute tw-p-2 price-radius tw-bg-warning-dark tw-text-text-grey tw-font-semibold tw-top-2 -tw-right-4 tw-rotate-45"
            v-if="item.name === 'Standard'"
            flat
          >
            Giá tốt nhất
          </div>
          <div class="tw-text-3xl tw-font-semibold tw-mt-3">
            {{ currencyFormat(item.yearlyPrice) }}
            <br />VNĐ/năm
          </div>
          <div
            class="tw-text-sm tw-font-semibold"
            :class="{
              'tw-text-white': item.name === 'Standard',
              'tw-text-primary': item.name !== 'Standard',
            }"
          >
            Tương đương {{ currencyFormat(item.monthlyPrice) }} VNĐ/th
          </div>
          <div class="tw-text-lg tw-font-semibold tw-mt-4">
            <q-icon
              name="devices"
              class="tw-mr-1"
              size="sm"
              :color="item.name === 'Standard' ? 'white' : ''"
            />
            {{ item.totalDevices }} thiết bị
          </div>
          <q-btn
            class="tw-w-full tw-font-semibold tw-mt-6"
            :class="{
              'tw-bg-white tw-text-text-grey': item.name === 'Standard',
              'tw-bg-primary tw-text-white': item.name !== 'Standard',
            }"
            size="md"
            no-caps
            :disable="
              item.name === 'Free' ||
              item.yearlyPrice < 10000 ||
              (userSubscriptions?.plan?.name === item.name &&
                userSubscriptions?.endDate &&
                `${Date.now()}` <=
                  date.formatDate(userSubscriptions?.endDate, 'x'))
            "
            flat
            @click="onUpgrade(item.id)"
          >
            {{
              userSubscriptions?.plan?.name === item.name &&
              userSubscriptions?.endDate &&
              `${Date.now()}` > date.formatDate(userSubscriptions?.endDate, 'x')
                ? 'Gia hạn'
                : userSubscriptions?.plan?.name === item.name
                ? 'Gói hiện tại'
                : 'Nâng cấp'
            }}
          </q-btn>
        </q-card>
      </div>
      <div class="tw-mt-6 tw-text-base tw-text-text-grey tw-text-center">
        *Hiện tại chức năng khẩn cấp chỉ khả dụng trên Android.
      </div>
      <div
        class="tw-mt-10 tw-text-[24px] tw-font-semibold tw-text-text-grey tw-text-center"
      >
        Các tính năng vượt trội giúp SafeZone Premium trở nên tuyệt vời
        <br />cho các bậc cha mẹ!
      </div>
      <div class="tw-mt-6 tw-flex tw-justify-center">
        <div class="sm:tw-grid sm:tw-grid-cols-2 sm:tw-gap-2">
          <div
            class="tw-flex tw-p-4"
            v-for="(item, index) in premiumFeatures"
            :key="index"
          >
            <q-icon
              :name="item.icon"
              class="tw-mr-4"
              color="secondary"
              size="lg"
            />
            <div>
              <div class="tw-text-secondary tw-text-md tw-font-semibold">
                {{ item.title }}
              </div>
              <div class="tw-mt-2 tw-text-sm tw-text-text-grey">
                {{ item.subtitle }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="upgradeDialog"
      upgradeDialog
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white tw-p-4">
        <q-card-section>
          <div class="text-h6">Vui lòng liên hệ chăm sóc khách hàng</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="selectPaymentMethodDialog"
      selectPaymentMethodDialog
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="tw-p-4">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Hình thức thanh toán</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div>
            <q-btn
              v-close-popup
              glossy
              style="
                padding: 20px;
                margin-right: 20px;
                background-color: #b1bdc5;
                min-width: 150px;
              "
              @click="handleUpgrade('CC')"
            >
              <div>
                <q-icon color="black" size="50px"
                  ><img src="icons/credit-card.png"
                /></q-icon>
                <div>Visa</div>
              </div></q-btn
            >

            <q-btn
              v-close-popup
              glossy
              style="padding: 20px; background-color: #b1bdc5; min-width: 150px"
              @click="handleUpgrade('ATM')"
              ><div>
                <q-icon color="black" size="50px"
                  ><img src="icons/atm.png"
                /></q-icon>
                <div>ATM</div>
              </div></q-btn
            >
          </div>
          <div style="margin-top: 20px">
            <q-btn
              v-close-popup
              glossy
              style="
                padding: 20px;
                margin-right: 20px;
                background-color: #b1bdc5;
                min-width: 150px;
              "
              @click="handleUpgrade('VA')"
              ><div>
                <q-icon color="black" size="50px"
                  ><img src="icons/bank-building.png"
                /></q-icon>
                <div>Chuyển khoản</div>
              </div></q-btn
            >
            <q-btn
              v-close-popup
              glossy
              style="padding: 20px; background-color: #b1bdc5; min-width: 150px"
              @click="handleUpgrade('EWALLET')"
              ><div>
                <q-icon color="black" size="50px"
                  ><img src="icons/wallet.png"
                /></q-icon>
                <div>EWallet</div>
              </div></q-btn
            >
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts" setup>
import { premiumFeatures } from '@/utils/fakeData';
import subscriptionApi from '@api/subscription';
import useUserStore from '@stores/user';
import { storeToRefs } from 'pinia';
import { date } from 'quasar';

const router = useRouter();
const { userSubscriptions }: any = storeToRefs(useUserStore());

const subscriptionData = ref([]);
const upgradeDialog = ref(false);
const selectPaymentMethodDialog = ref(false);
const planId = ref(null);

const currencyFormat = (value: number) => {
  if (value) {
    return value
      .toString()
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev;
      });
  }
  return '0';
};

const isCurrentPlan = computed(() => {});

const getPlans = async () => {
  const { getSubscriptionPlans } = subscriptionApi();

  try {
    $loading.start();
    const data: any = await getSubscriptionPlans();

    if (data) {
      subscriptionData.value = data.result;
      $loading.finish();
      return Promise.resolve(data);
    }
  } catch (error) {
    $loading.finish();
    return Promise.reject(error);
  }
};

const handleUpgrade = async (val) => {
  if (val) {
    const { initiatePayment } = subscriptionApi();

    try {
      $loading.start();
      const body = {
        subscriptionPlanId: planId.value,
        client: 'web',
        paymentMethod: val,
      };
      const data: any = await initiatePayment(body);

      if (data) {
        const paymentUrl = data.paymentUrl;
        window.location.replace(paymentUrl);
        $loading.finish();
        return Promise.resolve(data);
      }
    } catch (error) {
      $loading.finish();
      return Promise.reject(error);
    }
  }
};

const onUpgrade = async (id) => {
  // upgradeDialog.value = true;
  // return;
  planId.value = id;
  selectPaymentMethodDialog.value = true;
};

getPlans();
</script>

<style lang="scss" scoped>
.price-radius {
  border-radius: 4px !important;
}
.plans-wrapper {
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 80px);
    padding: 0px;
  }
  padding: 16px;
}
.plans-list {
  @media (min-width: 1024px) {
    flex-grow: 1;
    overflow-y: auto;
  }
  overflow: visible;
}
.card-wrapper {
  margin-top: 24px;

  &:first-child {
    margin-top: 0px;
  }

  @media (min-width: 768px) {
    margin-top: 0px;
  }
}
</style>
