// AI Fine-tuning 관련 데이터 구조

export interface FineTuningSubModule {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  topics: {
    left: string[];
    right: string[];
  };
  content: string;
  estimatedTime: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface FineTuningModule {
  id: string;
  title: string;
  description: string;
  subModules: FineTuningSubModule[];
}

export const fineTuningData: FineTuningModule = {
  id: 'ai-fine-tuning',
  title: 'AI Fine-tuning',
  description: '딥러닝의 기본 개념부터 Fine-tuning까지 체계적으로 학습합니다.',
  subModules: [
    {
      id: 'neural-networks-basics',
      title: 'Neural Networks Basics',
      englishTitle: 'Neural Networks Basics',
      description: '신경망의 기본 개념과 동작 원리를 학습합니다.',
      topics: {
        left: ['Perceptron', 'Activation Functions', 'Feedforward Networks', 'Backpropagation'],
        right: ['Gradient Descent Variants', 'Loss Functions', 'Regularization Techniques']
      },
      content: `# Neural Networks Basics

## 개요
신경망(Neural Networks)은 딥러닝의 핵심 구성 요소입니다. 이 모듈에서는 신경망의 기본 개념부터 고급 기법까지 체계적으로 학습합니다.

## 주요 학습 내용

### 1. Perceptron (퍼셉트론)
퍼셉트론은 가장 단순한 형태의 인공 신경망입니다.
- 단일 레이어 퍼셉트론의 구조와 동작 원리
- 선형 분류 문제 해결 방법
- 퍼셉트론의 한계와 다층 퍼셉트론의 필요성

### 2. Activation Functions (활성화 함수)
활성화 함수는 신경망에 비선형성을 추가하는 핵심 요소입니다.
- Sigmoid, Tanh, ReLU 함수의 특징과 장단점
- 각 활성화 함수의 수학적 특성
- 상황에 맞는 활성화 함수 선택 방법

### 3. Feedforward Networks (순전파 네트워크)
입력에서 출력으로 정보가 한 방향으로만 흐르는 네트워크입니다.
- 다층 퍼셉트론(MLP) 구조
- 순전파(Forward Propagation) 과정
- 네트워크 깊이와 너비의 영향

### 4. Backpropagation (역전파)
역전파는 신경망 학습의 핵심 알고리즘입니다.
- 역전파 알고리즘의 수학적 원리
- 체인 룰(Chain Rule)을 활용한 그래디언트 계산
- 효율적인 역전파 구현 방법

### 5. Gradient Descent Variants (경사 하강법 변형)
최적화 알고리즘의 다양한 변형을 학습합니다.
- 기본 경사 하강법(Gradient Descent)
- 확률적 경사 하강법(SGD)
- Adam, RMSprop 등 적응형 최적화 알고리즘

### 6. Loss Functions (손실 함수)
모델의 성능을 측정하는 손실 함수를 이해합니다.
- 회귀 문제: MSE, MAE
- 분류 문제: Cross-Entropy, Hinge Loss
- 손실 함수 선택 기준

### 7. Regularization Techniques (정규화 기법)
과적합을 방지하는 정규화 기법을 학습합니다.
- L1, L2 정규화
- Dropout 기법
- Batch Normalization
- Early Stopping

## 실습 프로젝트
- 간단한 신경망을 처음부터 구현
- 다양한 활성화 함수 비교 실험
- 정규화 기법의 효과 검증`,
      estimatedTime: '4주',
      level: 'beginner'
    },
    {
      id: 'cnns',
      title: 'Convolutional Neural Networks (CNNs)',
      englishTitle: 'Convolutional Neural Networks (CNNs)',
      description: '이미지 처리에 특화된 합성곱 신경망을 학습합니다.',
      topics: {
        left: ['Convolutional Layers', 'Pooling Layers', 'CNN Architectures (LeNet, AlexNet, VGGNet)', 'Receptive Field'],
        right: ['Data Augmentation for CNNs', 'Transfer Learning with CNNs', 'Object Detection Fundamentals']
      },
      content: `# Convolutional Neural Networks (CNNs)

## 개요
합성곱 신경망(CNN)은 이미지 인식, 컴퓨터 비전 분야에서 가장 널리 사용되는 딥러닝 모델입니다.

## 주요 학습 내용

### 1. Convolutional Layers (합성곱 레이어)
이미지의 공간적 특징을 추출하는 핵심 레이어입니다.
- 합성곱 연산의 수학적 원리
- 필터(Filter)와 특징 맵(Feature Map)
- 패딩(Padding)과 스트라이드(Stride)의 역할
- 다중 채널 합성곱

### 2. Pooling Layers (풀링 레이어)
특징 맵의 크기를 줄이고 계산량을 감소시킵니다.
- Max Pooling과 Average Pooling
- 풀링의 역할과 효과
- Global Pooling 기법

### 3. CNN Architectures (CNN 아키텍처)
주요 CNN 아키텍처의 발전 과정을 학습합니다.
- **LeNet**: 초기 CNN 아키텍처
- **AlexNet**: 딥러닝 붐을 일으킨 모델
- **VGGNet**: 깊은 네트워크의 중요성
- **ResNet**: 잔차 연결(Residual Connection)
- **Inception**: 효율적인 네트워크 설계

### 4. Receptive Field (수용 영역)
각 뉴런이 입력 이미지의 어느 영역을 보는지 이해합니다.
- 수용 영역의 개념과 계산 방법
- 수용 영역 확장 기법
- 다중 스케일 특징 추출

### 5. Data Augmentation for CNNs (데이터 증강)
제한된 데이터로 모델 성능을 향상시키는 기법입니다.
- 회전, 이동, 스케일링 변환
- 색상 조정 및 노이즈 추가
- Cutout, Mixup 등 고급 증강 기법

### 6. Transfer Learning with CNNs (전이 학습)
사전 학습된 모델을 활용하여 효율적으로 학습합니다.
- 사전 학습 모델 활용 방법
- Fine-tuning 전략
- Feature Extraction vs Fine-tuning
- Domain Adaptation

### 7. Object Detection Fundamentals (객체 탐지 기초)
이미지에서 객체를 찾고 분류하는 기초를 학습합니다.
- 객체 탐지 문제의 특성
- R-CNN, Fast R-CNN, Faster R-CNN
- YOLO와 SSD 같은 단일 단계 탐지기
- IoU, mAP 등 평가 지표

## 실습 프로젝트
- CIFAR-10 데이터셋으로 CNN 모델 구축
- 전이 학습을 활용한 이미지 분류
- 간단한 객체 탐지 모델 구현`,
      estimatedTime: '6주',
      level: 'intermediate'
    },
    {
      id: 'rnns',
      title: 'Recurrent Neural Networks (RNNs)',
      englishTitle: 'Recurrent Neural Networks (RNNs)',
      description: '시퀀스 데이터 처리에 특화된 순환 신경망을 학습합니다.',
      topics: {
        left: ['Recurrent Connections', 'Vanishing/Exploding Gradients', 'Long Short-Term Memory (LSTM)', 'Gated Recurrent Units (GRUs)'],
        right: ['Sequence-to-Sequence Models', 'Attention Mechanisms', 'Applications of RNNs']
      },
      content: `# Recurrent Neural Networks (RNNs)

## 개요
순환 신경망(RNN)은 시퀀스 데이터를 처리하기 위해 설계된 신경망입니다. 자연어 처리, 시계열 분석 등에 널리 사용됩니다.

## 주요 학습 내용

### 1. Recurrent Connections (순환 연결)
이전 상태를 기억하여 시퀀스 정보를 처리합니다.
- RNN의 기본 구조와 동작 원리
- 순환 연결의 수학적 표현
- 시퀀스 길이에 따른 처리 방법
- 양방향 RNN(Bidirectional RNN)

### 2. Vanishing/Exploding Gradients (기울기 소실/폭발)
RNN 학습 시 발생하는 주요 문제와 해결 방법입니다.
- 기울기 소실 문제의 원인
- 기울기 폭발 문제와 해결책
- Gradient Clipping 기법
- LSTM과 GRU의 해결 방법

### 3. Long Short-Term Memory (LSTM)
장기 의존성을 학습할 수 있는 LSTM 구조를 이해합니다.
- LSTM의 핵심 아이디어: 게이트 메커니즘
- Forget Gate, Input Gate, Output Gate
- LSTM의 수학적 모델링
- LSTM의 다양한 변형

### 4. Gated Recurrent Units (GRUs)
LSTM보다 간단하면서도 효과적인 GRU를 학습합니다.
- GRU의 구조와 LSTM과의 차이점
- Reset Gate와 Update Gate
- 언제 GRU를 사용해야 하는가
- GRU vs LSTM 성능 비교

### 5. Sequence-to-Sequence Models (시퀀스-투-시퀀스 모델)
입력 시퀀스를 출력 시퀀스로 변환하는 모델입니다.
- Encoder-Decoder 구조
- 기계 번역에의 응용
- Teacher Forcing과 Scheduled Sampling
- Beam Search 디코딩

### 6. Attention Mechanisms (어텐션 메커니즘)
중요한 정보에 집중하는 어텐션 메커니즘을 학습합니다.
- 어텐션의 기본 개념
- Scaled Dot-Product Attention
- Multi-Head Attention
- Self-Attention과 Cross-Attention
- Transformer 아키텍처의 기초

### 7. Applications of RNNs (RNN의 응용)
RNN이 실제로 어떻게 활용되는지 학습합니다.
- 자연어 처리: 텍스트 분류, 감성 분석
- 기계 번역: Neural Machine Translation
- 음성 인식: Speech Recognition
- 시계열 예측: 주가 예측, 날씨 예측
- 텍스트 생성: 챗봇, 요약

## 실습 프로젝트
- 감성 분석 모델 구축
- 간단한 챗봇 구현
- 시계열 데이터 예측 모델 개발`,
      estimatedTime: '6주',
      level: 'intermediate'
    },
    {
      id: 'transformers',
      title: 'Transformers',
      englishTitle: 'Transformers',
      description: '어텐션 메커니즘 기반의 트랜스포머 모델을 학습합니다.',
      topics: {
        left: ['Self-Attention Mechanism', 'Multi-Head Attention', 'Transformer Architecture (Encoder & Decoder)', 'Positional Encoding'],
        right: ['BERT, GPT, and other Transformer Variants', 'Fine-tuning Transformers for NLP Tasks', 'Applications of Transformers']
      },
      content: `# Transformers

## 개요
트랜스포머(Transformer)는 어텐션 메커니즘을 핵심으로 하는 딥러닝 아키텍처입니다. 자연어 처리 분야에서 혁신적인 성과를 거두었으며, 현재 대부분의 최신 NLP 모델의 기반이 되고 있습니다.

## 주요 학습 내용

### 1. Self-Attention Mechanism (셀프 어텐션 메커니즘)
입력 시퀀스 내의 모든 위치 간의 관계를 동시에 학습합니다.
- 어텐션의 기본 개념과 수학적 원리
- Query, Key, Value 벡터의 역할
- Scaled Dot-Product Attention의 계산 과정
- 셀프 어텐션의 장점과 특징

### 2. Multi-Head Attention (멀티 헤드 어텐션)
여러 개의 어텐션 헤드를 병렬로 사용하여 다양한 관점에서 정보를 추출합니다.
- 멀티 헤드 어텐션의 구조
- 각 헤드가 학습하는 서로 다른 표현
- 헤드 수 선택 방법
- 계산 효율성 최적화

### 3. Transformer Architecture (Encoder & Decoder) (트랜스포머 아키텍처)
인코더와 디코더로 구성된 트랜스포머의 전체 구조를 이해합니다.
- **Encoder**: 입력 시퀀스를 의미 있는 표현으로 변환
- **Decoder**: 인코더 출력을 바탕으로 출력 시퀀스 생성
- Feed-Forward Networks의 역할
- Residual Connection과 Layer Normalization
- 인코더-디코더 어텐션 메커니즘

### 4. Positional Encoding (위치 인코딩)
순서 정보를 모델에 제공하는 위치 인코딩을 학습합니다.
- 위치 인코딩의 필요성
- Sinusoidal Positional Encoding
- 학습 가능한 위치 임베딩
- 상대적 위치 인코딩 기법

### 5. BERT, GPT, and other Transformer Variants (BERT, GPT 및 기타 트랜스포머 변형)
주요 트랜스포머 모델들의 특징과 차이점을 학습합니다.
- **BERT**: 양방향 인코더 기반 모델
- **GPT**: 단방향 디코더 기반 모델
- **T5**: Text-to-Text Transfer Transformer
- **RoBERTa, ALBERT**: BERT 개선 모델
- 각 모델의 장단점과 활용 분야

### 6. Fine-tuning Transformers for NLP Tasks (NLP 작업을 위한 트랜스포머 파인튜닝)
사전 학습된 트랜스포머 모델을 특정 작업에 맞게 파인튜닝합니다.
- 파인튜닝 전략과 방법
- Task-specific 레이어 추가
- 학습률 스케줄링
- 데이터셋 준비 및 전처리
- 다양한 NLP 작업에의 적용 (분류, QA, NER 등)
- Few-shot Learning과 Prompt Engineering

### 7. Applications of Transformers (트랜스포머의 응용)
트랜스포머가 실제로 어떻게 활용되는지 학습합니다.
- 자연어 이해: 텍스트 분류, 감성 분석, 질의응답
- 자연어 생성: 텍스트 요약, 번역, 대화 생성
- 멀티모달 학습: Vision Transformer, CLIP
- 코드 생성 및 이해: CodeBERT, GitHub Copilot
- 음성 처리: Whisper, SpeechT5

## 실습 프로젝트
- BERT를 활용한 감성 분석 모델 구축
- GPT를 활용한 텍스트 생성
- 트랜스포머 모델 파인튜닝 실습
- 다양한 NLP 태스크에의 적용`,
      estimatedTime: '8주',
      level: 'advanced'
    }
  ]
};

// 교육 리소스 링크
export interface EducationResource {
  id: string;
  title: string;
  type: 'elearning' | 'offline';
  provider: string;
  url: string;
  price?: string;
  description?: string;
}

export const educationResources: EducationResource[] = [
  {
    id: 'resource-1',
    title: '딥러닝 기초부터 Fine-tuning까지',
    type: 'elearning',
    provider: '인프런',
    url: 'https://www.inflearn.com',
    price: '₩99,000',
    description: '딥러닝의 기본 개념부터 실전 Fine-tuning까지 체계적으로 학습할 수 있는 온라인 강의입니다.'
  },
  {
    id: 'resource-2',
    title: 'PyTorch로 배우는 딥러닝',
    type: 'elearning',
    provider: 'Coursera',
    url: 'https://www.coursera.org',
    price: '무료 (인증서 유료)',
    description: 'PyTorch를 활용한 딥러닝 실습 강의입니다.'
  },
  {
    id: 'resource-3',
    title: 'TensorFlow 실전 프로젝트',
    type: 'elearning',
    provider: 'Udemy',
    url: 'https://www.udemy.com',
    price: '₩49,000',
    description: 'TensorFlow를 사용한 실전 프로젝트 중심 강의입니다.'
  },
  {
    id: 'resource-4',
    title: 'AI Fine-tuning 부트캠프',
    type: 'offline',
    provider: '멀티캠퍼스',
    url: 'https://www.multicampus.com',
    price: '₩2,500,000',
    description: '4주 집중 오프라인 부트캠프로 실무 역량을 기를 수 있습니다.'
  },
  {
    id: 'resource-5',
    title: '딥러닝 실무 워크샵',
    type: 'offline',
    provider: '패스트캠퍼스',
    url: 'https://www.fastcampus.co.kr',
    price: '₩1,200,000',
    description: '주말 집중 워크샵으로 딥러닝 실무 역량을 향상시킵니다.'
  },
  {
    id: 'resource-6',
    title: 'AI 엔지니어 양성 과정',
    type: 'offline',
    provider: '부스트캠프',
    url: 'https://www.boostcamp.co.kr',
    price: '무료 (선발제)',
    description: '네이버 부스트캠프 AI Tech 과정입니다.'
  }
];

