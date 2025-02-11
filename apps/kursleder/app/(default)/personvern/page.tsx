import { Article } from "@/components/article";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumbs";

export default function Page() {
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Startsiden</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Personvern</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      <Article>
        <h1>Personvern</h1>
        <p className="lead">Personvernerklæring</p>
      </Article>
    </div>
  );
}
