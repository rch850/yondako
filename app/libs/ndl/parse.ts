import imageNoImage from "@/assets/images/noimage.webp";
import { THUMBNAIL_API_BASE_URL } from "@/constants/api";
import { BookType } from "@/types/book";
import { AnyNode } from "domhandler";
import { getElementsByTagName, textContent } from "domutils";
import * as htmlparser2 from "htmlparser2";

const getValue = (tagName: string, node: AnyNode | AnyNode[]) => {
  const elements = getElementsByTagName(tagName, node, false, 1);
  return textContent(elements).trim();
};

const getValues = (tagName: string, node: AnyNode | AnyNode[]) => {
  const elements = getElementsByTagName(tagName, node, false);

  if (elements.length === 0) {
    return undefined;
  }

  const values = elements.map((e) => textContent(e).trim());
  return [...new Set(values)];
};

const getValueByAttr = (
  tagName: string,
  attrName: string,
  attrValue: string,
  node: AnyNode | AnyNode[],
) => {
  const elements = getElementsByTagName(tagName, node, false);

  for (const elm of elements) {
    if (elm.attribs[attrName] === attrValue) {
      return textContent(elm).trim();
    }
  }

  return undefined;
};

/**
 * 書影画像のURLを作成
 * @param id JP-eコードもしくはISBN-13
 * @return URL
 */
const createThumbnailUrl = (id: string) => {
  return `${THUMBNAIL_API_BASE_URL}/${id.replace(/-/g, "")}.jpg`;
};

/**
 * NDL API (OpenSearch) のレスポンスをパース
 * @param xml レスポンス (RSS)
 * @returns Bookオブジェクトの配列
 */
export const parseOpenSearchResponse = (xml: string) => {
  // NOTE: 自己完結タグがあるとうまくパースできないので除く
  const replacedXml = xml.replace(/<\S+\/>/g, "");

  const dom = htmlparser2.parseDocument(replacedXml);
  let results: BookType[] = [];

  for (const childNode of dom.childNodes) {
    const items = getElementsByTagName("item", childNode).map(
      (item): BookType => {
        const { children } = item;

        let title = getValue("title", children);

        // 巻数があればタイトルに追加
        const vol = getValue("dcndl:volume", children);
        if (vol) {
          title = `${title} (${vol})`;
        }

        const isbn = getValueByAttr(
          "dc:identifier",
          "xsi:type",
          "dcndl:ISBN",
          children,
        );

        const thumbnailUrl = isbn ? createThumbnailUrl(isbn) : imageNoImage;

        return {
          title,
          link: getValue("guid", children),
          authors: getValues("dc:creator", children),
          publisher: getValues("dc:publisher", children),
          isbn,
          ndlBibId: getValueByAttr(
            "dc:identifier",
            "xsi:type",
            "dcndl:NDLBibID",
            children,
          ),
          jpNo: getValueByAttr(
            "dc:identifier",
            "xsi:type",
            "dcndl:JPNO",
            children,
          ),
          thumbnailUrl,
        };
      },
    );

    results = results.concat(items);
  }

  return results;
};
