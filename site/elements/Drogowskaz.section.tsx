import { GuideBar } from "@/site/features/ui/GuideBar.widget.tsx";
export default function Drogowskaz() {
  return (
    <GuideBar
      items={[
        { name: "?", local: "/404" /*, public: "/guide/intro"*/ },
        { name: "1.0:. Wzory", local: "/" /*, public: "/guide/intro"*/ },
        { name: "2.0:. Dokumentacja", local: "/dokumentacja" /*, public: "/guide/intro"*/ },
        { name: "3.0:. O dokumentacji", local: "/o-dokumentacji" /*, public: "/guide/intro"*/ },
      ]}
    />
  );
}
